FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
        libreoffice-writer \
        fonts-thai-tlwg \
        fonts-tlwg-sarabun \
        fontconfig \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /usr/share/fonts/truetype/thsarabun \
    && (find /app/fonts -name "*.ttf" -exec cp {} /usr/share/fonts/truetype/thsarabun/ \; 2>/dev/null; exit 0) \
    && (find /app/fonts -name "*.otf" -exec cp {} /usr/share/fonts/truetype/thsarabun/ \; 2>/dev/null; exit 0) \
    && fc-cache -f

ENV HOST=0.0.0.0
CMD ["python", "server.py"]
