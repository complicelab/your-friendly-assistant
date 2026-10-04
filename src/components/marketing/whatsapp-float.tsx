import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=+573161772880&text=Hola.%20Me%20interesa%20sus%20servicios%20de...";

export function WhatsAppFloat() {
  return (
    <a
      className="whatsapp-float"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Abrir chat con Cómplice Lab por WhatsApp"
    >
      <MessageCircle size={24} />
      <span>Hablemos</span>
    </a>
  );
}
