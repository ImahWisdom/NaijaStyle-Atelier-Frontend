import { FaWhatsapp } from 'react-icons/fa'

const WHATSAPP_NUMBER = '2348183547260'
const DEFAULT_MESSAGE = encodeURIComponent(
  "Hi NaijaStyle Atelier! 👋 I'm interested in your products and would love to know more."
)

export default function WhatsAppButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${DEFAULT_MESSAGE}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3"
    >
      <span className="hidden group-hover:flex items-center bg-black text-white text-xs tracking-wide px-3 py-2 rounded-lg whitespace-nowrap shadow-lg transition-all">
        Chat with us
      </span>
      <div className="relative w-14 h-14">
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping" />
        <div className="relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300">
          <FaWhatsapp size={28} className="text-white" />
        </div>
      </div>
    </a>
  )
}
