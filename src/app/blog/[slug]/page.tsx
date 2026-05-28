"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Share2, Bookmark, ChevronLeft, Send } from "lucide-react";

const allPosts: Record<string, {
  slug: string; title: string; date: string; readTime: string; tag: string; likes: number;
  images: string[]; content: string[];
  comments: { id: number; author: string; text: string; date: string; likes: number }[];
}> = {
  "como-curar-cogollos": {
    slug: "como-curar-cogollos",
    title: "Cómo curar cogollos correctamente",
    date: "28 May 2026", readTime: "5 min", tag: "Cuidados", likes: 234,
    images: [
      "https://images.unsplash.com/photo-1503262028195-93c528f03218?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&h=800&fit=crop",
    ],
    content: [
      "El curado es, sin duda, una de las fases más importantes y más olvidadas del proceso. Una buena cosecha puede arruinarse completamente con un mal curado, mientras que un curado paciente puede elevar una cosecha mediocre a algo realmente especial.",
      "## ¿Qué es el curado?",
      "El curado es el proceso de secado lento y controlado de los cogollos tras la cosecha. Durante este proceso, los clorofilas se degradan, los terpenos maduran y el sabor mejora de forma dramática.",
      "## Paso 1: Secado inicial",
      "Cuelga las ramas boca abajo en un espacio oscuro con buena ventilación. Temperatura ideal: 18-22°C. Humedad: 45-55%.",
      "## Paso 2: Manicurado",
      "Una vez secas, retira las hojas grandes con tijeras afiladas. Este paso mejora la estética y el sabor final.",
      "## Paso 3: Curado en botes",
      "Coloca los cogollos en botes de cristal herméticos, llenándolos al 75%. Los primeros 14 días, abre los botes dos veces al día durante 10-15 minutos.",
      "## Consejos pro",
      "- Usa botes de cristal oscuro para proteger de la luz UV\n- Invierte en un higrómetro digital\n- La humedad ideal dentro del bote es 58-62%\n- Nunca cures en plástico o metal",
    ],
    comments: [
      { id: 1, author: "María G.", text: "Increíble guía, me ha ayudado mucho con mi primera cosecha.", date: "27 May 2026", likes: 12 },
      { id: 2, author: "Carlos R.", text: "¿Qué opináis de los botes Boveda?", date: "26 May 2026", likes: 8 },
    ],
  },
  "mejores-fertilizantes-organicos": {
    slug: "mejores-fertilizantes-organicos",
    title: "Los 5 mejores fertilizantes orgánicos",
    date: "25 May 2026", readTime: "4 min", tag: "Cultivo", likes: 187,
    images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=800&fit=crop"],
    content: [
      "Los fertilizantes orgánicos son la base de un cultivo saludable y sostenible. A continuación te presentamos los 5 más efectivos.",
      "## 1. Humus de lombriz",
      "Rico en nutrientes y microorganismos. Perfecto para todas las fases del ciclo.",
      "## 2. Guano de murciélago",
      "Alto en fósforo, ideal para floración. Aplicar con moderación.",
      "## 3. Harina de hueso",
      "Fuente de fósforo y calcio de liberación lenta.",
      "## 4. Melaza",
      "Alimenta la vida microbiana del sustrato. Usar en riego durante floración.",
      "## 5. Té de compost",
      "La forma más completa de aportar vida al sustrato. Preparar en 24-48h con aireación.",
    ],
    comments: [
      { id: 1, author: "Pedro L.", text: "Gran selección, el humus de lombriz es mi favorito.", date: "24 May 2026", likes: 5 },
    ],
  },
  "indoor-vs-outdoor": {
    slug: "indoor-vs-outdoor",
    title: "Indoor vs Outdoor: pros y contras",
    date: "22 May 2026", readTime: "6 min", tag: "Cultivo", likes: 312,
    images: ["https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&h=800&fit=crop"],
    content: [
      "Elegir entre cultivo indoor y outdoor depende de muchos factores. Vamos a analizar los pros y contras de cada método.",
      "## Indoor: Ventajas",
      "Control total del ambiente, cosechas durante todo el año, mayor discreción.",
      "## Indoor: Desventajas",
      "Mayor inversión inicial, consumo eléctrico, espacio limitado.",
      "## Outdoor: Ventajas",
      "Luz solar gratuita, mayor producción por planta, menor coste.",
      "## Outdoor: Desventajas",
      "Dependencia del clima, plagas, una sola cosecha al año.",
    ],
    comments: [
      { id: 1, author: "Ana M.", text: "Indoor 100%, el control es clave.", date: "21 May 2026", likes: 14 },
    ],
  },
  "guia-esquejes": {
    slug: "guia-esquejes",
    title: "Guía completa de esquejes",
    date: "18 May 2026", readTime: "5 min", tag: "Cultivo", likes: 156,
    images: ["https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=1200&h=800&fit=crop"],
    content: [
      "Los esquejes son la forma más fiable de reproducir una genética que te gusta.",
      "## Material necesario",
      "Tijeras esterilizadas, gel de enraizamiento, jiffy o lana de roca, propagador con tapa.",
      "## Técnica paso a paso",
      "Corta un tallo de 10-15cm con al menos 2 nudos. Corte en diagonal bajo un nudo. Aplica gel y coloca en el sustrato.",
      "## Condiciones ideales",
      "Humedad 80-90%, temperatura 22-25°C, luz tenue 18h. Raíces en 7-14 días.",
    ],
    comments: [],
  },
  "nutrientes-fase-floracion": {
    slug: "nutrientes-fase-floracion",
    title: "Nutrientes en fase de floración",
    date: "15 May 2026", readTime: "4 min", tag: "Cuidados", likes: 201,
    images: ["https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&h=800&fit=crop"],
    content: [
      "La fase de floración requiere un cambio radical en la nutrición de tus plantas.",
      "## Reducir nitrógeno",
      "El nitrógeno debe reducirse gradualmente al entrar en floración.",
      "## Aumentar fósforo y potasio",
      "PK son los macronutrientes clave en floración. Aumentar progresivamente.",
      "## Flush final",
      "Las últimas 2 semanas riega solo con agua para limpiar sales y mejorar el sabor.",
    ],
    comments: [
      { id: 1, author: "Luis F.", text: "El flush final marca toda la diferencia.", date: "14 May 2026", likes: 9 },
    ],
  },
  "como-hacer-mantequilla-cannabica": {
    slug: "como-hacer-mantequilla-cannabica",
    title: "Cómo hacer mantequilla cannábica",
    date: "12 May 2026", readTime: "7 min", tag: "Recetas", likes: 445,
    images: ["https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=1200&h=800&fit=crop"],
    content: [
      "La mantequilla cannábica (cannabutter) es la base de casi todas las recetas de comestibles.",
      "## Ingredientes",
      "250g de mantequilla sin sal, 7-10g de material vegetal descarboxilado, agua.",
      "## Descarboxilación",
      "Hornea el material a 110°C durante 40 minutos para activar el THC.",
      "## Preparación",
      "Derrite la mantequilla con agua a fuego bajo. Añade el material y cocina 2-3 horas sin hervir. Cuela con estopilla.",
      "## Dosificación",
      "Empieza con poca cantidad. Los efectos tardan 45-90 minutos en aparecer.",
    ],
    comments: [
      { id: 1, author: "Sofía R.", text: "La mejor receta que he encontrado. Resultados increíbles.", date: "11 May 2026", likes: 22 },
    ],
  },
  "variedades-autoflorecientes": {
    slug: "variedades-autoflorecientes",
    title: "Las mejores variedades autoflorecientes de 2026",
    date: "10 May 2026", readTime: "5 min", tag: "Genética", likes: 289,
    images: ["https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&h=800&fit=crop"],
    content: [
      "Las autoflorecientes han evolucionado enormemente. Estas son las más destacadas de 2026.",
      "## 1. Critical Auto",
      "Producción masiva en 70 días. Fácil de cultivar.",
      "## 2. Gorilla Glue Auto",
      "Potencia brutal, resina abundante. Ideal para extracciones.",
      "## 3. Purple Punch Auto",
      "Colores espectaculares y sabor dulce. Perfecta para principiantes.",
    ],
    comments: [],
  },
  "ph-del-agua-riego": {
    slug: "ph-del-agua-riego",
    title: "pH del agua de riego: la clave que muchos ignoran",
    date: "8 May 2026", readTime: "4 min", tag: "Cuidados", likes: 178,
    images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=800&fit=crop"],
    content: [
      "El pH del agua de riego es fundamental para la absorción de nutrientes.",
      "## pH ideal",
      "En tierra: 6.0-7.0. En hidro/coco: 5.5-6.5.",
      "## Cómo medir",
      "Usa un medidor digital de pH. Calibra semanalmente.",
      "## Cómo ajustar",
      "pH Up (bicarbonato) o pH Down (ácido fosfórico). Ajusta antes de regar.",
    ],
    comments: [
      { id: 1, author: "Diego M.", text: "Desde que controlo el pH todo va mucho mejor.", date: "7 May 2026", likes: 6 },
    ],
  },
  "galletas-cannabis": {
    slug: "galletas-cannabis",
    title: "Receta: Galletas de cannabis perfectas",
    date: "5 May 2026", readTime: "6 min", tag: "Recetas", likes: 523,
    images: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=1200&h=800&fit=crop"],
    content: [
      "Galletas crujientes por fuera, tiernas por dentro. Con dosificación precisa.",
      "## Ingredientes",
      "100g cannabutter, 150g harina, 100g azúcar moreno, 1 huevo, chips de chocolate, vainilla.",
      "## Preparación",
      "Mezcla mantequilla y azúcar. Añade huevo y vainilla. Incorpora harina. Añade chips.",
      "## Horneado",
      "180°C durante 10-12 minutos. Dejar enfriar en bandeja.",
      "## Dosificación",
      "Cada galleta ≈ 10-15mg THC. Espera al menos 1 hora antes de repetir.",
    ],
    comments: [
      { id: 1, author: "Marta V.", text: "Espectaculares! La receta perfecta.", date: "4 May 2026", likes: 18 },
    ],
  },
};

const defaultPost = allPosts["como-curar-cogollos"];

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const mockPost = allPosts[slug] || defaultPost;
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
