FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
        libreoffice-writer \
        fonts-thai-tlwg \
        fontconfig \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

RUN mkdir -p /usr/share/fonts/truetype/thsarabun \
    && (cp /app/fonts/*.ttf /usr/share/fonts/truetype/thsarabun/ 2>/dev/null || true) \
    && (cp /app/fonts/*.otf /usr/share/fonts/truetype/thsarabun/ 2>/dev/null || true) \
    && fc-cache -f

ENV HOST=0.0.0.0
CMD ["python", "server.py"]
