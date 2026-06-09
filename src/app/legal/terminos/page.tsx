import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones — RYOKU",
};

export default function TerminosPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <p className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--brand)] mb-2">Legal</p>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">Términos y Condiciones</h1>

      <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
        <p>
          Los siguientes términos y condiciones regulan el uso del sitio web ryoku-sand.vercel.app
          y la compra de productos en el mismo.
        </p>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Información general</h2>
        <p>
          El titular de este sitio web es RYOKU, con domicilio en España y correo de contacto hola@ryoku.es.
          El acceso y uso del sitio web atribuye la condición de usuario e implica la aceptación íntegra
          de estos términos.
        </p>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Productos y precios</h2>
        <p>
          Los precios mostrados incluyen IVA. Nos reservamos el derecho a modificar los precios en
          cualquier momento, pero los cambios no afectarán a pedidos ya confirmados.
        </p>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Proceso de compra</h2>
        <p>
          Para realizar un pedido, el usuario debe seguir el proceso de compra online, seleccionar
          los productos, completar los datos de envío y realizar el pago. Una vez confirmado el pago,
          recibirás un correo de confirmación con los detalles del pedido.
        </p>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Envíos</h2>
        <p>
          Realizamos envíos a España peninsular. Los plazos de entrega son orientativos y pueden
          variar según la disponibilidad del producto y la dirección de envío.
        </p>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Devoluciones</h2>
        <p>
          El usuario dispone de 14 días desde la recepción del producto para ejercer su derecho de
          desistimiento. Los productos deben estar en su estado original. Para gestionar una
          devolución, escribe a hola@ryoku.es.
        </p>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Propiedad intelectual</h2>
        <p>
          Todo el contenido del sitio web (textos, imágenes, diseños, logotipos) es propiedad de
          RYOKU o cuenta con la correspondiente licencia de uso. Queda prohibida su reproducción
          total o parcial sin autorización expresa.
        </p>
      </div>

      <div className="mt-12">
        <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
