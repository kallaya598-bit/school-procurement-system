FROM python:3.12-slim

# Install LibreOffice + Thai fonts
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libreoffice-writer \
        fonts-thai-tlwg \
        fonts-tlwg-sarabun \
        fonts-tlwg-sarabun-otf \
        fontconfig \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Copy TH Sarabun fonts from repo
RUN mkdir -p /usr/share/fonts/truetype/thsarabun && \
    find fonts/ -name "*.ttf" -exec cp {} /usr/share/fonts/truetype/thsarabun/ \; 2>/dev/null || true && \
    find fonts/ -name "*.otf" -exec cp {} /usr/share/fonts/truetype/thsarabun/ \; 2>/dev/null || true

# Create fontconfig alias: TH SarabunPSK → TH Sarabun (so LibreOffice finds it)
RUN mkdir -p /etc/fonts/conf.d && cat > /etc/fonts/conf.d/99-th-sarabun-alias.conf << 'FONTCONF'
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <alias>
    <family>TH SarabunPSK</family>
    <prefer>
      <family>TH Sarabun</family>
      <family>THSarabun</family>
    </prefer>
  </alias>
</fontconfig>
FONTCONF

RUN fc-cache -f -v

ENV HOST=0.0.0.0
CMD ["python", "server.py"]
