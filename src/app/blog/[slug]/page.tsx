"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Share2, Bookmark, ChevronLeft, Send } from "lucide-react";

const mockPost = {
  slug: "como-curar-cogollos",
  title: "Cómo curar cogollos correctamente",
  date: "28 May 2026",
  readTime: "5 min",
  tag: "Cuidados",
  likes: 234,
  images: [
    "https://images.unsplash.com/photo-1503262028195-93c528f03218?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&h=800&fit=crop",
  ],
  content: [
    "El curado es, sin duda, una de las fases más importantes y más olvidadas del proceso. Una buena cosecha puede arruinarse completamente con un mal curado, mientras que un curado paciente puede elevar una cosecha mediocre a algo realmente especial.",
    "## ¿Qué es el curado?",
    "El curado es el proceso de secado lento y controlado de los cogollos tras la cosecha. Durante este proceso, los clorofilas se degradan, los terpenos maduran y el sabor mejora de forma dramática. Piensa en ello como el envejecimiento del vino: tiempo = calidad.",
    "## Paso 1: Secado inicial",
    "Cuelga las ramas boca abajo en un espacio oscuro con buena ventilación. Temperatura ideal: 18-22°C. Humedad: 45-55%. Este proceso dura entre 7 y 14 días. Sabrás que están listas cuando los tallos finos se rompan al doblarlos (no se doblen).",
    "## Paso 2: Manicurado",
    "Una vez secas, retira las hojas grandes con tijeras afiladas. Este paso mejora la estética y el sabor final. Guarda los recortes para hacer extracciones o mantequilla cannábica.",
    "## Paso 3: Curado en botes",
    "Coloca los cogollos en botes de cristal herméticos, llenándolos al 75%. Los primeros 14 días, abre los botes dos veces al día durante 10-15 minutos ('burping'). Después, reduce a una vez al día durante 2 semanas más.",
    "## Consejos pro",
    "- Usa botes de cristal oscuro para proteger de la luz UV\n- Invierte en un higrómetro digital para cada bote\n- La humedad ideal dentro del bote es 58-62%\n- Cuanto más tiempo cures (hasta 6 meses), mejor será el resultado\n- Nunca cures en plástico o metal, altera los terpenos",
  ],
  comments: [
    { id: 1, author: "María G.", text: "Increíble guía, me ha ayudado mucho con mi primera cosecha. El tip del higrómetro es clave.", date: "27 May 2026", likes: 12 },
    { id: 2, author: "Carlos R.", text: "¿Qué opináis de los botes Boveda? ¿Merece la pena la inversión?", date: "26 May 2026", likes: 8 },
    { id: 3, author: "Laura P.", text: "Llevaba tiempo buscando algo así de completo. Compartido con mi grupo de cultivo!", date: "25 May 2026", likes: 15 },
  ],
};

export default function BlogPostPage() {
  const params = useParams();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(mockPost.likes);
  const [saved, setSaved] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [comment, setComment] = useState("");

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
      {/* Back */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Blog
        </Link>
      </motion.div>

      {/* Image carousel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--surface)]">
          <Image
            src={mockPost.images[currentImage]}
            alt={mockPost.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
          {/* Dots */}
          {mockPost.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {mockPost.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImage === i
                      ? "bg-white w-6"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Action bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-4 mb-6"
      >
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked ? "text-red-500" : "text-[var(--text-muted)] hover:text-red-400"
          }`}
        >
          <Heart className={`w-5 h-5 ${liked ? "fill-red-500" : ""}`} />
          {likeCount}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors">
          <MessageCircle className="w-5 h-5" />
          {mockPost.comments.length}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setSaved(!saved)}
          className={`transition-colors ${
            saved ? "text-[var(--brand)]" : "text-[var(--text-muted)] hover:text-[var(--brand)]"
          }`}
        >
          <Bookmark className={`w-5 h-5 ${saved ? "fill-[var(--brand)]" : ""}`} />
        </button>
      </motion.div>

      {/* Meta */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[var(--brand-glow)] text-[var(--brand)] rounded-full">
            {mockPost.tag}
          </span>
          <span className="text-xs text-[var(--text-muted)]">{mockPost.date}</span>
          <span className="text-xs text-[var(--text-muted)]">· {mockPost.readTime} lectura</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
          {mockPost.title}
        </h1>
      </motion.div>

      {/* Content */}
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-12"
      >
        {mockPost.content.map((block, i) => {
          if (block.startsWith("## ")) {
            return (
              <h2
                key={i}
                className="text-xl font-bold mt-8 mb-3 text-[var(--text)]"
              >
                {block.replace("## ", "")}
              </h2>
            );
          }
          if (block.startsWith("- ")) {
            const items = block.split("\n");
            return (
              <ul key={i} className="space-y-2 my-4">
                {items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] mt-1.5 flex-shrink-0" />
                    {item.replace("- ", "")}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={i} className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              {block}
            </p>
          );
        })}
      </motion.article>

      {/* Comments */}
      <section className="border-t border-[var(--border)] pt-8">
        <h3 className="text-lg font-bold mb-6">
          Comentarios ({mockPost.comments.length})
        </h3>

        {/* Comment input */}
        <div className="flex gap-3 mb-8">
          <div className="w-9 h-9 rounded-full bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-[var(--text-muted)]">TÚ</span>
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="w-full px-4 py-2.5 pr-10 rounded-full bg-[var(--surface)] border border-[var(--border)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand)] transition-colors"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brand)] hover:text-[var(--brand-hover)] transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Comments list */}
        <div className="space-y-6">
          {mockPost.comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--brand-glow)] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[var(--brand)]">
                  {c.author.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{c.author}</span>
                  <span className="text-xs text-[var(--text-muted)]">{c.date}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {c.text}
                </p>
                <button className="flex items-center gap-1 mt-2 text-xs text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors">
                  <Heart className="w-3 h-3" />
                  {c.likes}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
