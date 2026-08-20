/* =========================================================
   GEOLOCATION — Captura de GPS e geocodificação
   ========================================================= */

import { state, salvarEstado } from './state.js';

export function capturarLocalizacaoAutomatica(renderCallback) {
  if (!("geolocation" in navigator)) {
    state.geoStatus = "erro";
    state.geoMensagem = "Seu navegador não suporta geolocalização.";
    salvarEstado();
    if(renderCallback) renderCallback();
    return;
  }

  state.buscandoGeo = true;
  state.geoStatus = "buscando";
  if(renderCallback) renderCallback();

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6);
      state.coordenadas = `${lat}, ${lon}`;
      state.geoStatus = "sucesso";

      try {
        const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.address) {
            const a = data.address;
            const rua = a.road || a.pedestrian || a.suburb || "";
            const num = a.house_number ? `, ${a.house_number}` : "";
            const bairro = a.suburb || a.neighbourhood || "";
            const cidade = a.city || a.town || a.municipality || "";
            
            let endFmt = rua + num;
            if (bairro && !rua.includes(bairro)) endFmt += (endFmt ? " - " : "") + bairro;
            if (cidade) endFmt += (endFmt ? ", " : "") + cidade;

            state.endereco = endFmt || data.display_name;
          }
        }
      } catch(e) {
        // Ignora falha de rede reversa silenciosamente e mantém coordenadas
      } finally {
        state.buscandoGeo = false;
        salvarEstado();
        if(renderCallback) renderCallback();
      }
    },
    (err) => {
      state.buscandoGeo = false;
      state.geoStatus = "erro";
      if (err.code === err.PERMISSION_DENIED) {
        state.geoMensagem = "Permissão de localização negada. Ative o GPS nas configurações do dispositivo/navegador.";
      } else {
        state.geoMensagem = "Não foi possível obter a localização automaticamente. Por favor, certifique-se de que o GPS está ligado.";
      }
      salvarEstado();
      if(renderCallback) renderCallback();
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
  );
}