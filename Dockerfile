FROM python:3.12-slim

# Install LibreOffice + Thai fonts base
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libreoffice-writer \
        fonts-thai-tlwg \
        fontconfig \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Copy TH Sarabun fonts from repo into system
RUN mkdir -p /usr/share/fonts/truetype/thsarabun && \
    find fonts/ -name "*.ttf" -exec cp {} /usr/share/fonts/truetype/thsarabun/ \; 2>/dev/null || true && \
    find fonts/ -name "*.otf" -exec cp {} /usr/share/fonts/truetype/thsarabun/ \; 2>/dev/null || true && \
    fc-cache -f -v

ENV HOST=0.0.0.0
CMD ["python", "server.py"]
