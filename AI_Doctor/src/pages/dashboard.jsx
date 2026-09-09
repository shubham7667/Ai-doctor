import React, { useRef, useState } from 'react'

const formatAnswer = (text) => text.split(/\r?\n/).map((line, index) => {
    const trimmedLine = line.trim()
    const headingMatch = trimmedLine.match(/^#{1,6}\s*(.*)$/)
    const isListItem = /^[-*]\s+/.test(trimmedLine)
    const isNote = /^(note|important)\s*:/i.test(trimmedLine)
    const cleanText = (headingMatch ? headingMatch[1] : trimmedLine)
        .replace(/^[-*]\s+/, '')
        .replace(/^>\s*/, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/[`*_]/g, '')
        .replace(/[✅⚠️💡]/gu, '')
        .trim()

    if (!cleanText) return <div key={index} className="h-3" />
    if (headingMatch) return <h3 key={index} className="pt-3 text-lg font- bold leading-7 text-slate-900">{cleanText}</h3>
    if (isNote) return <p key={index} className="my-2 rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">{cleanText}</p>
    if (isListItem) return <p key={index} className="border-l-2 border-emerald-200 pl-4 leading-7 text-slate-600">{cleanText}</p>

    return <p key={index} className="leading-7 text-slate-600">{cleanText}</p>
})

const Dashboard = () => {
    const [image, setImage] = useState(null)
    const [recording, setRecording] = useState(false)
    const [audioblob, setAudioblob] = useState(null)
    const [answer, setAnswer] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const mediaRecorderRef = useRef(null)

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const recorder = new MediaRecorder(stream)

        mediaRecorderRef.current = recorder
        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) setAudioblob(event.data)
        }
        recorder.start()
        setRecording(true)
    }

    const stopRecording = () => {
        const recorder = mediaRecorderRef.current
        if (!recorder) return

        recorder.stop()
        recorder.stream.getTracks().forEach((track) => track.stop())
        setRecording(false)
    }

    const sendQuery = async () => {
        if (!image || !audioblob) {
            setError('Add an image and finish an audio recording before sending.')
            return
        }

        setLoading(true)
        setError(null)
        setAnswer(null)

        const formData = new FormData()
        formData.append('image', image)
        formData.append('audio', audioblob, 'recording.webm')

        try {
            const response = await fetch('http://localhost:8000/doctor/query', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            })
            const data = await response.json()

            if (!response.ok) throw new Error(data.detail || 'The query failed.')
            setAnswer(data.answer)
        } catch (requestError) {
            setError(requestError.message || 'The AI doctor could not respond.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-[#f4f8f7] px-4 py-8 text-slate-900 sm:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8 flex flex-col justify-between gap-4 border-b border-emerald-100 pb-6 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">AI Doctor / Consultation room</p>
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Understand your symptoms</h1>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Share a scan and describe how you feel. Your AI doctor will organize the information into a clear next step.</p>
                    </div>
                    <div className="flex items-center gap-2 self-start rounded-full border border-emerald-100 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 shadow-sm sm:self-auto">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Private consultation
                    </div>
                </header>

                <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.06)] sm:p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Step 01</p>
                                <h2 className="mt-1 text-xl font-semibold">Provide context</h2>
                            </div>
                            <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Required</span>
                        </div>

                        <label className="group block cursor-pointer rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-400 hover:bg-emerald-50/40">
                            <div className="flex items-center gap-4">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl text-emerald-700">+</span>
                                <span>
                                    <span className="block text-sm font-semibold text-slate-800">Upload a medical image</span>
                                    <span className="mt-1 block text-xs text-slate-500">JPG, PNG or WEBP</span>
                                </span>
                            </div>
                            <input type="file" accept="image/*" className="sr-only" onChange={(event) => setImage(event.target.files[0])} />
                        </label>

                        {image && (
                            <div className="mt-4 overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50">
                                <img src={URL.createObjectURL(image)} alt="Selected medical scan" className="h-48 w-full object-cover" />
                                <p className="truncate px-3 py-2 text-xs font-medium text-emerald-800">{image.name}</p>
                            </div>
                        )}

                        <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400"><span className="h-px flex-1 bg-slate-100" />Then describe<span className="h-px flex-1 bg-slate-100" /></div>

                        <button onClick={recording ? stopRecording : startRecording} className={`flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${recording ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100' : 'bg-slate-900 text-white hover:bg-emerald-700'}`}>
                            <span className={`h-2.5 w-2.5 rounded-full ${recording ? 'animate-pulse bg-rose-500' : 'bg-emerald-400'}`} />
                            {recording ? 'Stop recording' : audioblob ? 'Record again' : 'Start voice recording'}
                        </button>
                        {audioblob && !recording && <p className="mt-3 text-center text-xs font-medium text-emerald-700">Voice note ready to review</p>}
                        {error && <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

                        <button onClick={sendQuery} disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60">
                            {loading ? 'Reviewing your information...' : 'Get AI doctor insight'}
                            {!loading && <span aria-hidden="true">-&gt;</span>}
                        </button>
                    </section>

                    <section className="relative h-[640px] overflow-hidden rounded-2xl border border-emerald-100 bg-[#e8f4ef] p-5 sm:p-8">
                        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-[18px] border-white/40" />
                        <div className="relative">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Step 02 / Your consultation</p>
                            {answer ? (
                                <article className="mt-5 flex h-[540px] flex-col rounded-2xl bg-white p-5 shadow-[0_18px_50px_rgba(16,80,61,0.1)] sm:p-7">
                                    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">AI doctor insight</div>
                                            <h2 className="mt-2 text-2xl font-bold text-slate-950">Your guidance is ready</h2>
                                        </div>
                                        <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:block">Analysis complete</span>
                                    </div>
                                    <div className="mt-6 min-h-0 flex-1 space-y-2 overflow-y-auto pr-3 text-[15px] [scrollbar-width:thin] [scrollbar-color:#10b981_transparent]">{formatAnswer(answer)}</div>
                                    <p className="mt-7 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400">This guidance is informational and does not replace an in-person medical diagnosis.</p>
                                </article>
                            ) : (
                                <div className="mt-5 flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-white/60 px-8 text-center">
                                    <h2 className="mt-5 text-xl font-semibold text-slate-900">Your response will appear here</h2>
                                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Add your image and voice note, then let the AI doctor bring the details together.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}

export default Dashboard
