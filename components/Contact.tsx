// useClient: necesario para estado del formulario, validación y animaciones
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import emailjs from "@emailjs/browser";
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_NOTIFICATION_TEMPLATE_ID,
  EMAILJS_AUTOREPLY_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
} from "@/lib/emailjs";

// CONTENT: textos del formulario en ES/EN con placeholders, botón y mensajes de estado
const CONTENT = {
  es: {
    section_title: "Enviar_Mensaje",
    placeholders: {
      name: "Tu nombre aquí",
      email: "tu_correo@dominio.com",
      message: "Escribe tu propuesta o saludo...",
    },
    submit_button: "> ejecutar_envio.sh",
    sending_text: "[ENVIANDO...]",
    validation_error: "ValidationError: el campo {field} es requerido",
    success_message: "¡Mensaje enviado con éxito! [Status 200]",
    error_message: "Error al enviar. Intenta de nuevo. [Status 500]",
    rate_limit_error: "[RateLimit] Espera {seconds}s antes de enviar otro mensaje",
    nav_back_to_top: "VOLVER ARRIBA",
    editor_filename: "contact_script.py",
    error_credentials_hint: "revisa tus credenciales e inténtalo de nuevo.",
  },
  en: {
    section_title: "Send_Message",
    placeholders: {
      name: "Your name here",
      email: "your_email@domain.com",
      message: "Write your proposal or greeting...",
    },
    submit_button: "> run_send.sh",
    sending_text: "[SENDING...]",
    validation_error: "ValidationError: field {field} is required",
    success_message: "Message sent successfully! [Status 200]",
    error_message: "Error sending. Try again. [Status 500]",
    rate_limit_error: "[RateLimit] Wait {seconds}s before sending another message",
    nav_back_to_top: "BACK TO TOP",
    editor_filename: "contact_script.py",
    error_credentials_hint: "check your credentials and try again.",
  },
};

interface ContactProps {
  lang: "es" | "en";
}

// FieldKey: tipos de campos del formulario
type FieldKey = "name" | "email" | "message";

// Contact: formulario de contacto estilo editor de código con validación y barra de progreso
export default function Contact({ lang }: ContactProps) {
  const c = CONTENT[lang];
  // form: estado con valores de los campos
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  // status: controla el estado del envío (idle, sending, success, error)
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  // errors: errores de validación por campo
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  // progress: progreso de la barra de carga simulada (0-100)
  const [progress, setProgress] = useState(0);
  // honeypot: campo oculto anti-bots
  const [honeypot, setHoneypot] = useState("");
  // rateLimitMsg: mensaje de rate limit (vacío si no aplica)
  const [rateLimitMsg, setRateLimitMsg] = useState("");
  // lastSubmit: timestamp del último envío exitoso para rate limiting
  const lastSubmit = useRef(0);
  const RATE_LIMIT_MS = 30000;

  // scrollTo: helper para navegación suave al inicio
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // fieldConfigs: configuración de los campos con nombre de variable y tipo (input/textarea)
  const fieldConfigs: Array<{
    key: FieldKey;
    varName: string;
    type: "input" | "textarea";
    rows?: number;
  }> = [
    { key: "name", varName: "sender_name", type: "input" },
    { key: "email", varName: "sender_email", type: "input" },
    { key: "message", varName: "message_body", type: "textarea", rows: 6 },
  ];

  // fieldLabels: etiquetas de los campos según el idioma
  const fieldLabels: Record<FieldKey, string> = {
    name: lang === "es" ? "nombre" : "name",
    email: lang === "es" ? "email" : "email",
    message: lang === "es" ? "mensaje" : "message",
  };

  // validate: verifica que todos los campos estén completos y muestra errores
  const validate = (): boolean => {
    const newErrors: Partial<Record<FieldKey, string>> = {};
    for (const { key } of fieldConfigs) {
      if (!form[key].trim()) {
        newErrors[key] = c.validation_error.replace(
          "{field}",
          fieldLabels[key],
        );
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handleSubmit: valida form, chequea honeypot y rate limit, envía dos emails vía EmailJS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot: si tiene valor, un bot lo llenó — silenciamos con falso éxito
    if (honeypot) {
      setStatus("success");
      setProgress(100);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    // Rate limit: impedir envíos repetidos antes de 30s
    const elapsed = Date.now() - lastSubmit.current;
    if (elapsed < RATE_LIMIT_MS) {
      const remaining = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000);
      setRateLimitMsg(c.rate_limit_error.replace("{seconds}", String(remaining)));
      return;
    }
    setRateLimitMsg("");

    if (!validate()) return;
    setStatus("sending");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 10;
      });
    }, 75);

    const templateParams = {
      sender_name: form.name,
      sender_email: form.email,
      message: form.message,
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_NOTIFICATION_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY,
      );
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_AUTOREPLY_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY,
      );
      clearInterval(interval);
      setProgress(100);
      setStatus("success");
      lastSubmit.current = Date.now();
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      clearInterval(interval);
      setProgress(0);
      setStatus("error");
    }
  };

  // loadingBar: genera representación visual estilo terminal [████░░░░░░]
  const loadingBar = (n: number) =>
    `[${"\u2588".repeat(Math.floor(n / 10))}${"\u2591".repeat(10 - Math.floor(n / 10))}]`;

  // lines: números de línea para el editor de código simulado
  const lines = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <section
      id="contact"
      className="relative min-h-[90vh] w-full flex flex-col items-center justify-center px-4 md:px-8 py-14 bg-gradient-to-b from-background via-card/50 to-background overflow-hidden"
    >
      {/* Título */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-primary text-xl md:text-2xl font-mono">
          {c.section_title}
        </h2>
      </motion.div>

      {/* Tarjeta del formulario estilo editor de código */}
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        whileInView={{ y: 0, opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-2xl bg-card border border-card-border rounded-lg overflow-hidden"
      >
        {/* Barra superior con puntos de colores y nombre del archivo */}
        <div className="bg-card px-4 py-3 flex items-center gap-2 border-b border-card-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-muted text-sm font-mono ml-4">
            {c.editor_filename}
          </span>
        </div>

        {/* Cuerpo del editor con campos y botón de envío */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <p className="text-code-green font-mono text-lg">
                  {c.success_message}
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
              >
                {/* Honeypot: invisible a humanos, bots lo llenan */}
                <input
                  type="text"
                  name="honeypot"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute -left-[9999px] opacity-0 pointer-events-none"
                  aria-hidden="true"
                />
                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 font-mono text-xs mb-4 ml-8"
                  >
                    {c.error_message}
                    <span className="text-muted ml-2">
                      {c.error_credentials_hint}
                    </span>
                  </motion.p>
                )}
                {rateLimitMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-yellow-500 font-mono text-xs mb-4 ml-8"
                  >
                    {rateLimitMsg}
                  </motion.p>
                )}
                {/* Renderiza líneas del editor: campos 1-3, línea 4 vacía, botón en línea 5 */}
                {lines.map((lineNum) => {
                  const fieldIdx = lineNum - 1;
                  const field = fieldConfigs[fieldIdx];

                  // Línea 4: espacio en blanco (separador visual)
                  if (lineNum === 4) {
                    return (
                      <div key={lineNum} className="flex items-start mb-3">
                        <span className="text-muted font-mono text-xs select-none w-8 shrink-0 pt-1">
                          {lineNum}
                        </span>
                        <div className="flex-1" />
                      </div>
                    );
                  }

                  // Líneas 5+: botón de envío y posiblemente más controles
                  if (lineNum >= 5) {
                    return (
                      <div key={lineNum} className="flex items-start mb-3">
                        <span className="text-muted font-mono text-xs select-none w-8 shrink-0 pt-1">
                          {lineNum}
                        </span>
                        {lineNum === 5 && (
                          <div className="flex-1">
                            <button
                              type="submit"
                              disabled={status === "sending"}
                              className="w-full bg-gradient-to-r from-primary to-secondary text-background font-mono font-bold py-3 px-6 rounded hover:shadow-[0_0_20px_var(--primary)] transition-all duration-300 disabled:opacity-80"
                            >
                              {status === "sending" ? (
                                // Estado de envío con barra de progreso
                                <span className="flex items-center justify-center gap-2">
                                  {c.sending_text}
                                  <span className="text-background font-mono text-xs">
                                    {loadingBar(progress)}
                                  </span>
                                </span>
                              ) : (
                                c.submit_button
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Si no hay field config para esta línea, no renderiza nada
                  if (!field) return null;

                  const error = errors[field.key];

                  // Renderiza campo (input o textarea) con sintaxis const varName = "valor"
                  return (
                    <div key={lineNum} className="mb-1">
                      <div className="flex items-start">
                        {/* Número de línea */}
                        <span className="text-muted font-mono text-xs select-none w-8 shrink-0 pt-1">
                          {lineNum}
                        </span>
                        <div className="flex-1 flex items-start gap-1 font-mono text-sm flex-wrap">
                          <span className="text-secondary shrink-0">const</span>
                          <span className="text-foreground shrink-0">
                            {field.varName}
                          </span>
                          <span className="text-muted shrink-0">=</span>
                          <span className="text-code-green shrink-0">
                            &quot;
                          </span>
                          {field.type === "textarea" ? (
                            <textarea
                              rows={field.rows ?? 2}
                              value={form[field.key]}
                              onChange={(e) => {
                                setForm((s) => ({
                                  ...s,
                                  [field.key]: e.target.value,
                                }));
                                if (errors[field.key]) {
                                  setErrors((prev) => {
                                    const next = { ...prev };
                                    delete next[field.key];
                                    return next;
                                  });
                                }
                              }}
                              placeholder={c.placeholders[field.key]}
                              aria-label={fieldLabels[field.key]}
                              className="bg-transparent border-none outline-none focus:ring-0 border-b border-card-border focus:border-primary font-mono text-code-green resize-y flex-1 min-w-0 h-5 leading-tight"
                            />
                          ) : (
                            <input
                              type="text"
                              value={form[field.key]}
                              onChange={(e) => {
                                setForm((s) => ({
                                  ...s,
                                  [field.key]: e.target.value,
                                }));
                                if (errors[field.key]) {
                                  setErrors((prev) => {
                                    const next = { ...prev };
                                    delete next[field.key];
                                    return next;
                                  });
                                }
                              }}
                              placeholder={c.placeholders[field.key]}
                              aria-label={fieldLabels[field.key]}
                              className="bg-transparent border-none outline-none focus:ring-0 border-b border-card-border focus:border-primary font-mono text-code-green flex-1 min-w-0 h-5 leading-tight"
                            />
                          )}
                          <span className="text-code-green shrink-0">
                            &quot;
                          </span>
                        </div>
                      </div>
                      {/* Mensaje de error del campo */}
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 font-mono text-xs mt-1 ml-8"
                        >
                          {error}
                        </motion.p>
                      )}
                    </div>
                  );
                })}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      {/* Grid overlay decorativo */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>
      {/* Botón BACK TO TOP */}
      <div className="mt-12 flex items-center justify-center gap-6">
        <motion.button
          onClick={() => scrollTo("hero")}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 text-xs font-mono text-muted hover:text-primary transition-colors duration-300 group"
        >
          <ChevronUp
            size={16}
            className="group-hover:-translate-y-0.5 transition-transform duration-300"
          />
          <span className="tracking-wider">{c.nav_back_to_top}</span>
        </motion.button>
      </div>
    </section>
  );
}
