import base64

from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

from app.core.config import GROQ_API_KEY


llm = ChatGroq(
    groq_api_key=GROQ_API_KEY,
    model="qwen/qwen3.8-27b",
    temperature=0,
    max_tokens=512
)

fallback_llm = ChatGroq(
    groq_api_key=GROQ_API_KEY,
    model="qwen/qwen3.6-27b",
    temperature=0,
    max_tokens=512
)


def ask_llm(question, image_bytes, image_content_type):
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")

    message = HumanMessage(
        content=[
            {
                "type": "text",
                "text": question
            },
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:{image_content_type};base64,{image_base64}"
                }
            }
        ]
    )

    try:
        response = llm.invoke([message])
    except Exception as exc:
        error_text = str(exc).lower()
        if 'over capacity' not in error_text and 'rate_limit' not in error_text:
            raise
        response = fallback_llm.invoke([message])

    return response.content