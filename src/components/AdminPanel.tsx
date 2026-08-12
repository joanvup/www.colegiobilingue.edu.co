import { useState, useEffect, FormEvent } from "react";
import { useLanguage } from "../i18n";
import { 
  Lock, Settings, Mail, Phone, Server, Database, Trash2, Eye, EyeOff, 
  CheckCircle2, AlertTriangle, LogOut, ArrowLeft, Check, Loader2, KeyRound, RefreshCw, Send, Inbox, ShieldAlert,
  Calendar, Megaphone, Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { language } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  
  // Configuration states
  const [smtpConfig, setSmtpConfig] = useState({
    host: "",
    port: 587,
    secure: false,
    user: "",
    pass: "",
    sender: "contactenos@colegiobilingue.edu.co",
    recipient: "contactenos@colegiobilingue.edu.co",
    admissionsRecipient: "admisiones@colegiobilingue.edu.co, contactenos@colegiobilingue.edu.co",
    adminPassword: "admin",
    recaptchaEnabled: false,
    recaptchaSiteKey: "",
    recaptchaSecretKey: "",
    googleCalendarId: "",
    googleCalendarApiKey: "",
  });

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [submissionsType, setSubmissionsType] = useState<"contact" | "admissions">("contact");
  const [activeTab, setActiveTab] = useState<"smtp" | "submissions" | "popup">("smtp");
  
  const [popupConfig, setPopupConfig] = useState({
    enabled: false,
    imageBase64: "",
    linkUrl: "",
    startDate: "",
    endDate: ""
  });
  const [savingPopup, setSavingPopup] = useState(false);
  const [popupSaveSuccess, setPopupSaveSuccess] = useState(false);
  
  // Action status states
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [savingSmtp, setSavingSmtp] = useState(false);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [testSuccess, setTestSuccess] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Authentication logic
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoadingConfig(true);

    try {
      // Test auth by fetching the SMTP settings with the provided password
      const res = await fetch("/api/admin/smtp", {
        headers: {
          Authorization: `Bearer ${password}`,
          "X-Admin-Token": password,
        },
      });

      if (res.ok) {
        const config = await res.json();
        setSmtpConfig(config);
        setIsAuthenticated(true);
        localStorage.setItem("fcbv_admin_token", password);
        fetchSubmissions(password);
        fetchPopupConfig(password);
      } else {
        setAuthError(language === "EN" ? "Incorrect password" : "Contraseña incorrecta");
      }
    } catch (err) {
      setAuthError(language === "EN" ? "Network error" : "Error de conexión");
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    localStorage.removeItem("fcbv_admin_token");
    setSubmissions([]);
  };

  // Attempt auto-login if token is saved
  useEffect(() => {
    const savedToken = localStorage.getItem("fcbv_admin_token");
    if (savedToken && isOpen) {
      setPassword(savedToken);
      // Auto submit
      const autoAuth = async () => {
        try {
          const res = await fetch("/api/admin/smtp", {
            headers: { 
              Authorization: `Bearer ${savedToken}`,
              "X-Admin-Token": savedToken,
            },
          });
          if (res.ok) {
            const config = await res.json();
            setSmtpConfig(config);
            setIsAuthenticated(true);
            fetchSubmissions(savedToken);
            fetchPopupConfig(savedToken);
          } else {
            localStorage.removeItem("fcbv_admin_token");
          }
        } catch {
          localStorage.removeItem("fcbv_admin_token");
        }
      };
      autoAuth();
    }
  }, [isOpen]);

  // Fetch submissions helper
  const fetchSubmissions = async (token = password) => {
    setLoadingSubmissions(true);
    try {
      const [contactRes, admissionsRes] = await Promise.all([
        fetch("/api/admin/contact", { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "X-Admin-Token": token,
          } 
        }),
        fetch("/api/admin/admissions", { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "X-Admin-Token": token,
          } 
        })
      ]);

      if (contactRes.ok) {
        const data = await contactRes.json();
        setSubmissions([...data].reverse());
      }
      if (admissionsRes.ok) {
        const data = await admissionsRes.json();
        setAdmissions([...data].reverse());
      }
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const fetchPopupConfig = async (token = password) => {
    try {
      const res = await fetch("/api/admin/popup", {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Admin-Token": token,
        },
      });
      if (res.ok) {
        setPopupConfig(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch popup config:", err);
    }
  };

  const handleSavePopup = async (e: FormEvent) => {
    e.preventDefault();
    setSavingPopup(true);
    setPopupSaveSuccess(false);
    try {
      const res = await fetch("/api/admin/popup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
          "X-Admin-Token": password,
        },
        body: JSON.stringify(popupConfig),
      });

      if (res.ok) {
        setPopupSaveSuccess(true);
        setTimeout(() => setPopupSaveSuccess(false), 3000);
      } else {
        alert(language === "EN" ? "Failed to save popup configuration" : "Error al guardar la configuración del aviso");
      }
    } catch (err) {
      alert(language === "EN" ? "Network error" : "Error de conexión");
    } finally {
      setSavingPopup(false);
    }
  };

  // Save config logic
  const handleSaveSmtp = async (e: FormEvent) => {
    e.preventDefault();
    setSavingSmtp(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/admin/smtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
          "X-Admin-Token": password,
        },
        body: JSON.stringify(smtpConfig),
      });

      if (res.ok) {
        const data = await res.json();
        setSmtpConfig(data.smtp);
        setSaveSuccess(true);
        // If password was updated, update token
        if (smtpConfig.adminPassword !== password) {
          setPassword(smtpConfig.adminPassword);
          localStorage.setItem("fcbv_admin_token", smtpConfig.adminPassword);
        }
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        alert(language === "EN" ? "Failed to save settings" : "No se pudo guardar la configuración");
      }
    } catch (err) {
      console.error(err);
      alert(language === "EN" ? "Network error" : "Error de red");
    } finally {
      setSavingSmtp(false);
    }
  };

  // Test SMTP connection logic
  const handleTestSmtp = async () => {
    setTestingSmtp(true);
    setTestSuccess(null);
    setTestError(null);

    try {
      const res = await fetch("/api/admin/smtp/test", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${password}`,
          "X-Admin-Token": password,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setTestSuccess(
          language === "EN" 
            ? `Connection successful! Test email dispatched to ${smtpConfig.recipient}` 
            : `¡Conexión exitosa! Correo de prueba enviado a ${smtpConfig.recipient}`
        );
      } else {
        setTestError(data.error || (language === "EN" ? "SMTP connection failed" : "La conexión SMTP falló"));
      }
    } catch (err: any) {
      setTestError(err.message || (language === "EN" ? "Network error during test" : "Error de red durante la prueba"));
    } finally {
      setTestingSmtp(false);
    }
  };

  // Delete submission logic
  const handleDeleteSubmission = async (id: string, type: "contact" | "admissions") => {
    const confirmMsg = type === "contact"
      ? (language === "EN" ? "Are you sure you want to delete this message?" : "¿Está seguro de eliminar este mensaje?")
      : (language === "EN" ? "Are you sure you want to delete this application?" : "¿Está seguro de eliminar esta solicitud de admisión?");

    if (!confirm(confirmMsg)) return;

    try {
      const endpoint = type === "contact" ? `/api/admin/contact/${id}` : `/api/admin/admissions/${id}`;
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${password}`,
          "X-Admin-Token": password,
        },
      });

      if (res.ok) {
        fetchSubmissions();
      } else {
        alert(language === "EN" ? "Failed to delete" : "No se pudo eliminar");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-left"
      >
        {/* Header Bar */}
        <div className="bg-[#1B3A6B] text-white p-5 border-b border-[#C9A961]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-[#C9A961]/30">
              <Settings className="w-5 h-5 text-[#C9A961]" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold tracking-wide">
                {language === "EN" ? "Institutional Portal Admin" : "Panel de Administración Institucional"}
              </h3>
              <span className="text-[10px] font-mono text-slate-300 block uppercase tracking-wider">
                {language === "EN" ? "Bilingual School Platform" : "Colegio Bilingüe de Valledupar"}
              </span>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Mode */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto w-full flex flex-col justify-center items-center py-16">
            <div className="w-12 h-12 bg-[#F8F6F1] border border-[#C9A961]/40 rounded-full flex items-center justify-center text-[#1B3A6B] mb-4">
              <KeyRound className="w-6 h-6 text-[#C9A961]" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#1B3A6B] mb-2 text-center">
              {language === "EN" ? "Administrator Access" : "Acceso Administrativo"}
            </h4>
            <p className="text-xs text-slate-500 font-sans text-center mb-6 leading-relaxed">
              {language === "EN" 
                ? "Enter the administrator password to manage server SMTP connection options and view received submissions."
                : "Ingrese la contraseña administrativa para configurar el servidor SMTP y gestionar los mensajes del formulario."}
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="space-y-1.5 relative">
                <label className="text-[10px] uppercase tracking-wider text-slate-600 font-bold block">
                  {language === "EN" ? "Password" : "Contraseña de Administrador"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={language === "EN" ? "Enter admin password" : "Contraseña (ej. admin)"}
                    className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-4 py-3 text-sm pr-10 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loadingConfig}
                className="w-full py-3 bg-[#1B3A6B] hover:bg-[#122748] text-white rounded-xl text-sm font-bold tracking-wide uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {loadingConfig ? (
                  <>
                    <span>{language === "EN" ? "Checking..." : "Verificando..."}</span>
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  <>
                    <span>{language === "EN" ? "Authenticate" : "Autenticarse"}</span>
                    <Lock className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Mode */
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Sidebar Controls */}
            <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-5 flex flex-col justify-between shrink-0">
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold mb-3">
                  {language === "EN" ? "Menu Controls" : "Navegación Interna"}
                </span>
                
                <button
                  onClick={() => setActiveTab("smtp")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-colors cursor-pointer ${
                    activeTab === "smtp" 
                      ? "bg-[#1B3A6B] text-white border border-[#C9A961]/20" 
                      : "text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Server className="w-4 h-4 shrink-0" />
                  <span>{language === "EN" ? "SMTP Server" : "Servidor SMTP"}</span>
                </button>

                <button
                  onClick={() => setActiveTab("submissions")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-colors cursor-pointer relative ${
                    activeTab === "submissions" 
                      ? "bg-[#1B3A6B] text-white border border-[#C9A961]/20" 
                      : "text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Inbox className="w-4 h-4 shrink-0" />
                  <span>{language === "EN" ? "Inquiries Inbox" : "Buzón de Consultas"}</span>
                  {submissions.length + admissions.length > 0 && (
                    <span className="absolute right-3 bg-red-500 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full">
                      {submissions.length + admissions.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("popup")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-colors cursor-pointer ${
                    activeTab === "popup" 
                      ? "bg-[#1B3A6B] text-white border border-[#C9A961]/20" 
                      : "text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Megaphone className="w-4 h-4 shrink-0" />
                  <span>{language === "EN" ? "Welcome Popup" : "Popup de Inicio"}</span>
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-3 p-2 bg-slate-100 rounded-xl mb-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">
                    {language === "EN" ? "Admin Session Live" : "Sesión Administrador"}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>{language === "EN" ? "Sign Out" : "Cerrar Sesión"}</span>
                </button>
              </div>
            </div>

            {/* Dashboard Content Pane */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
              {activeTab === "smtp" ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#1B3A6B]">
                      {language === "EN" ? "SMTP Server Configuration" : "Configuración del Servidor SMTP"}
                    </h4>
                    <p className="text-xs text-slate-500 font-sans mt-1">
                      {language === "EN"
                        ? "Configure credentials to forward contact form submissions to contactenos@colegiobilingue.edu.co automatically."
                        : "Configure las credenciales SMTP para que los mensajes del formulario web se redirijan automáticamente al correo del colegio."}
                    </p>
                  </div>

                  <form onSubmit={handleSaveSmtp} className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                      <div className="grid sm:grid-cols-3 gap-6">
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">
                            {language === "EN" ? "SMTP Host" : "Host del Servidor (SMTP)"}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., smtp.gmail.com"
                            value={smtpConfig.host}
                            onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                            className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">
                            {language === "EN" ? "Port" : "Puerto"}
                          </label>
                          <input
                            type="number"
                            required
                            placeholder="587"
                            value={smtpConfig.port}
                            onChange={(e) => setSmtpConfig({ ...smtpConfig, port: Number(e.target.value) })}
                            className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-3 py-2.5 text-sm focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">
                            {language === "EN" ? "SMTP Username / User Email" : "Usuario SMTP (Correo de envío)"}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., mailer@domain.com"
                            value={smtpConfig.user}
                            onChange={(e) => setSmtpConfig({ ...smtpConfig, user: e.target.value })}
                            className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-3 py-2.5 text-sm focus:outline-none font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">
                            {language === "EN" ? "SMTP Password" : "Contraseña SMTP / App Password"}
                          </label>
                          <div className="relative">
                            <input
                              type={showSmtpPassword ? "text" : "password"}
                              required
                              placeholder="••••••••••••••••"
                              value={smtpConfig.pass}
                              onChange={(e) => setSmtpConfig({ ...smtpConfig, pass: e.target.value })}
                              className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-3 py-2.5 text-sm pr-10 focus:outline-none font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showSmtpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">
                            {language === "EN" ? "Contact Recipient Email" : "Destinatario de Contacto"}
                          </label>
                          <input
                            type="text"
                            required
                            value={smtpConfig.recipient}
                            onChange={(e) => setSmtpConfig({ ...smtpConfig, recipient: e.target.value })}
                            className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-3 py-2.5 text-sm focus:outline-none font-mono"
                          />
                          <p className="text-[9px] text-slate-400 font-sans">
                            {language === "EN" ? "For contact form inquiries" : "Para el formulario de contacto general"}
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">
                            {language === "EN" ? "Admissions Recipient Email(s)" : "Destinatario(s) de Admisiones"}
                          </label>
                          <input
                            type="text"
                            required
                            value={smtpConfig.admissionsRecipient}
                            onChange={(e) => setSmtpConfig({ ...smtpConfig, admissionsRecipient: e.target.value })}
                            className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-3 py-2.5 text-sm focus:outline-none font-mono"
                          />
                          <p className="text-[9px] text-slate-400 font-sans">
                            {language === "EN" ? "Can be comma-separated emails" : "Puede separar varios correos con comas"}
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">
                            {language === "EN" ? "Sender Display Name Alias" : "Alias de Envío (Sender Name)"}
                          </label>
                          <input
                            type="text"
                            required
                            value={smtpConfig.sender}
                            onChange={(e) => setSmtpConfig({ ...smtpConfig, sender: e.target.value })}
                            className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                          />
                          <p className="text-[9px] text-slate-400 font-sans">
                            {language === "EN" ? "Name shown to recipients" : "Nombre visible como remitente"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-[#F8F6F1] border border-[#C9A961]/25 rounded-xl">
                        <input
                          type="checkbox"
                          id="secure-mode"
                          checked={smtpConfig.secure}
                          onChange={(e) => setSmtpConfig({ ...smtpConfig, secure: e.target.checked })}
                          className="w-4 h-4 accent-[#1B3A6B] cursor-pointer"
                        />
                        <label htmlFor="secure-mode" className="text-xs text-slate-700 font-sans cursor-pointer font-medium select-none">
                          {language === "EN" 
                            ? "Use SSL/TLS secure connection protocol (Required for Port 465, leave unchecked for STARTTLS Port 587)" 
                            : "Utilizar protocolo seguro SSL/TLS (Requerido para Puerto 465, desactivar para STARTTLS Puerto 587)"}
                        </label>
                      </div>

                      {/* Google reCAPTCHA spam protection configuration */}
                      <div className="border-t border-slate-100 pt-6 space-y-4">
                        <div>
                          <h5 className="font-serif text-sm font-bold text-[#1B3A6B] flex items-center gap-2">
                            <Lock className="w-4 h-4 text-[#C9A961]" />
                            <span>{language === "EN" ? "Google reCAPTCHA Spam Protection" : "Protección Anti-Spam Google reCAPTCHA"}</span>
                          </h5>
                          <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                            {language === "EN"
                              ? "Prevent bots and automated scripts from submitting spam messages on your landing contact form."
                              : "Evite que bots y scripts automatizados envíen mensajes basura a través del formulario de contacto."}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                          <input
                            type="checkbox"
                            id="recaptcha-enable"
                            checked={smtpConfig.recaptchaEnabled}
                            onChange={(e) => setSmtpConfig({ ...smtpConfig, recaptchaEnabled: e.target.checked })}
                            className="w-4 h-4 accent-[#1B3A6B] cursor-pointer"
                          />
                          <label htmlFor="recaptcha-enable" className="text-xs text-slate-700 font-sans cursor-pointer font-bold select-none">
                            {language === "EN" 
                              ? "Enable Google reCAPTCHA v2 protection" 
                              : "Habilitar la protección Google reCAPTCHA v2"}
                          </label>
                        </div>

                        {smtpConfig.recaptchaEnabled && (
                          <div className="grid sm:grid-cols-2 gap-6 p-4 bg-[#F8F6F1]/50 border border-[#C9A961]/20 rounded-xl">
                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase tracking-wider text-slate-600 font-bold block">
                                {language === "EN" ? "reCAPTCHA Site Key (Public)" : "Site Key de reCAPTCHA (Público)"}
                              </label>
                              <input
                                type="text"
                                placeholder={language === "EN" ? "Enter site key" : "Ingrese site key de Google"}
                                value={smtpConfig.recaptchaSiteKey}
                                onChange={(e) => setSmtpConfig({ ...smtpConfig, recaptchaSiteKey: e.target.value })}
                                className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-3 py-2 text-xs focus:outline-none font-mono"
                              />
                              <p className="text-[9px] text-slate-400 font-sans">
                                {language === "EN" 
                                  ? "Leave blank to use Google's official public test key." 
                                  : "Deje en blanco para usar la clave de prueba pública oficial de Google."}
                              </p>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase tracking-wider text-slate-600 font-bold block">
                                {language === "EN" ? "reCAPTCHA Secret Key (Private)" : "Secret Key de reCAPTCHA (Privado)"}
                              </label>
                              <input
                                type="password"
                                placeholder="••••••••••••••••••••••••"
                                value={smtpConfig.recaptchaSecretKey}
                                onChange={(e) => setSmtpConfig({ ...smtpConfig, recaptchaSecretKey: e.target.value })}
                                className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-3 py-2 text-xs focus:outline-none font-mono"
                              />
                              <p className="text-[9px] text-slate-400 font-sans">
                                {language === "EN" 
                                  ? "Used on the backend server for private validation." 
                                  : "Se utiliza en el servidor backend para la validación privada de seguridad."}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Google Calendar Configuration */}
                      <div className="border-t border-slate-100 pt-6 space-y-4">
                        <div>
                          <h5 className="font-serif text-sm font-bold text-[#1B3A6B] flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#C9A961]" />
                            <span>{language === "EN" ? "Google Calendar Integration" : "Integración con Google Calendar"}</span>
                          </h5>
                          <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                            {language === "EN"
                              ? "Provide your public Google Calendar ID and an API Key to synchronize and display your institutional activities dynamically."
                              : "Ingrese el ID de su Google Calendar público y una clave API para sincronizar y mostrar las actividades del colegio automáticamente."}
                          </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6 p-4 bg-[#F8F6F1]/50 border border-[#C9A961]/20 rounded-xl">
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-slate-600 font-bold block">
                              {language === "EN" ? "Google Calendar ID" : "ID del Calendario de Google"}
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., primary or your-school@group.calendar.google.com"
                              value={smtpConfig.googleCalendarId || ""}
                              onChange={(e) => setSmtpConfig({ ...smtpConfig, googleCalendarId: e.target.value })}
                              className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-3 py-2 text-xs focus:outline-none font-mono"
                            />
                            <p className="text-[9px] text-slate-400 font-sans">
                              {language === "EN" 
                                ? "Make sure the Google Calendar has public read-only permissions enabled." 
                                : "Asegúrese de que el calendario de Google esté configurado como público (lectura)."}
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-slate-600 font-bold block">
                              {language === "EN" ? "Google Calendar API Key" : "Clave de API de Google Calendar"}
                            </label>
                            <input
                              type="password"
                              placeholder="AIzaSy..."
                              value={smtpConfig.googleCalendarApiKey || ""}
                              onChange={(e) => setSmtpConfig({ ...smtpConfig, googleCalendarApiKey: e.target.value })}
                              className="w-full bg-white border border-[#C9A961]/30 focus:border-[#1B3A6B] rounded-xl px-3 py-2 text-xs focus:outline-none font-mono"
                            />
                            <p className="text-[9px] text-slate-400 font-sans">
                              {language === "EN" 
                                ? "Your API key will remain securely stored on our backend server." 
                                : "Su clave de API se almacenará de manera totalmente segura en el servidor backend."}
                            </p>
                          </div>
                        </div>

                        {/* Interactive help collapsible for Google Calendar */}
                        <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-xl text-xs space-y-2">
                          <p className="font-bold text-amber-800 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>
                              {language === "EN"
                                ? "Important: Sharing Permissions Required"
                                : "Importante: Permisos de Compartido Requeridos"}
                            </span>
                          </p>
                          <p className="text-amber-700 leading-relaxed font-sans text-[11px]">
                            {language === "EN"
                              ? "To fetch and display your Google Calendar events without requiring user login, you MUST configure your calendar to be shared publicly: "
                              : "Para consultar y mostrar sus eventos de Google Calendar sin requerir inicio de sesión de los usuarios, DEBE configurar su calendario de forma pública: "}
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px] font-sans pl-1">
                            <li>
                              {language === "EN"
                                ? "Go to Google Calendar > find your calendar under 'My calendars' > click 'Settings and sharing'."
                                : "Vaya a Google Calendar > busque su calendario bajo 'Mis calendarios' > clic en 'Configuración y compartir'."}
                            </li>
                            <li>
                              {language === "EN"
                                ? "Scroll down to 'Access permissions for events' > check 'Make available to public' > set to 'See all event details'."
                                : "Baje hasta 'Permisos de acceso para eventos' > active 'Compartir de forma pública' > configure como 'Ver todos los detalles'."}
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-6 space-y-4">
                        <div className="space-y-1.5 max-w-md">
                          <label className="text-[10px] uppercase tracking-wider text-slate-600 font-bold block">
                            {language === "EN" ? "Update Portal Admin Password" : "Cambiar Contraseña de este Portal"}
                          </label>
                          <input
                            type="text"
                            required
                            value={smtpConfig.adminPassword}
                            onChange={(e) => setSmtpConfig({ ...smtpConfig, adminPassword: e.target.value })}
                            className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-3 py-2.5 text-sm focus:outline-none font-mono font-bold"
                          />
                          <p className="text-[9px] text-slate-400 font-sans">
                            {language === "EN"
                              ? "The password required to log into this panel next time."
                              : "Contraseña requerida para acceder a este panel de administración en el futuro."}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Test feedback notifications */}
                    {testSuccess && (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span>{testSuccess}</span>
                      </div>
                    )}
                    
                    {testError && (
                      <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-start gap-2.5">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                        <div className="space-y-1">
                          <span className="font-bold block">{language === "EN" ? "Test Connection Failed" : "La conexión de prueba falló"}</span>
                          <p className="font-mono text-[11px] leading-relaxed break-all">{testError}</p>
                        </div>
                      </div>
                    )}

                    {saveSuccess && (
                      <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl flex items-start gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                        <span>{language === "EN" ? "Configuration saved successfully!" : "¡La configuración se guardó correctamente!"}</span>
                      </div>
                    )}

                    {/* Submit buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={handleTestSmtp}
                        disabled={testingSmtp || savingSmtp || !smtpConfig.host || !smtpConfig.user || !smtpConfig.pass}
                        className="px-5 py-3 border border-[#1B3A6B] hover:bg-[#1B3A6B]/5 text-[#1B3A6B] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        {testingSmtp ? (
                          <>
                            <span>{language === "EN" ? "Testing SMTP..." : "Probando SMTP..."}</span>
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </>
                        ) : (
                          <>
                            <span>{language === "EN" ? "Send Test Email" : "Enviar Correo de Prueba"}</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <button
                        type="submit"
                        disabled={savingSmtp || testingSmtp}
                        className="px-6 py-3 bg-[#1B3A6B] hover:bg-[#122748] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        {savingSmtp ? (
                          <>
                            <span>{language === "EN" ? "Saving..." : "Guardando..."}</span>
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </>
                        ) : (
                          <>
                            <span>{language === "EN" ? "Save Settings" : "Guardar Configuración"}</span>
                            <Check className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : activeTab === "submissions" ? (
                /* Submissions inbox list */
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#1B3A6B]">
                        {language === "EN" ? "Inquiries Database Logs" : "Registro de Mensajes Recibidos"}
                      </h4>
                      <p className="text-xs text-slate-500 font-sans mt-1">
                        {language === "EN"
                          ? "These are contact and admissions form submissions stored on this local server."
                          : "Mensajes y solicitudes de admisión enviados por usuarios en la web. Se guardan localmente para su seguimiento."}
                      </p>
                    </div>

                    <button
                      onClick={() => fetchSubmissions()}
                      disabled={loadingSubmissions}
                      className="p-2 hover:bg-slate-200 border border-slate-300 rounded-lg text-slate-600 transition-colors cursor-pointer"
                      title={language === "EN" ? "Refresh" : "Actualizar"}
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingSubmissions ? "animate-spin" : ""}`} />
                    </button>
                  </div>

                  {/* Sub-tabs for Contact vs Admissions */}
                  <div className="flex border-b border-slate-200 gap-2">
                    <button
                      onClick={() => setSubmissionsType("contact")}
                      className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-300 cursor-pointer ${
                        submissionsType === "contact"
                          ? "border-[#1B3A6B] text-[#1B3A6B]"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {language === "EN" ? "Contact Messages" : "Mensajes de Contacto"} ({submissions.length})
                    </button>
                    <button
                      onClick={() => setSubmissionsType("admissions")}
                      className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-300 cursor-pointer ${
                        submissionsType === "admissions"
                          ? "border-[#1B3A6B] text-[#1B3A6B]"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {language === "EN" ? "Admissions Requests" : "Solicitudes de Admisión"} ({admissions.length})
                    </button>
                  </div>

                  {submissionsType === "contact" ? (
                    submissions.length === 0 ? (
                      <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                        <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h5 className="font-serif text-sm font-bold text-slate-600 mb-1">
                          {language === "EN" ? "Empty Inbox" : "Buzón de Mensajes Vacío"}
                        </h5>
                        <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto leading-relaxed">
                          {language === "EN"
                            ? "Submissions will show here when users dispatch the contact form on your front landing page."
                            : "Los mensajes enviados por visitantes en el formulario de contacto se registrarán en esta sección automáticamente."}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                        {submissions.map((sub) => (
                          <div
                            key={sub.id}
                            className="bg-white border border-slate-200 rounded-xl p-5 relative shadow-sm hover:shadow-md transition-shadow"
                          >
                            <button
                              onClick={() => handleDeleteSubmission(sub.id, "contact")}
                              className="absolute top-5 right-5 p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
                              title={language === "EN" ? "Delete permanently" : "Eliminar permanentemente"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="pr-12 space-y-3">
                              <div className="flex flex-wrap items-baseline gap-2">
                                <span className="font-serif font-bold text-base text-[#1B3A6B]">
                                  {sub.name}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  ID: {sub.id}
                                </span>
                              </div>

                              <div className="grid sm:grid-cols-2 gap-2 text-xs font-mono text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3.5 h-3.5 text-[#C9A961] shrink-0" />
                                  <a href={`mailto:${sub.email}`} className="hover:underline text-slate-700">{sub.email}</a>
                                </div>
                                {sub.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5 text-[#C9A961] shrink-0" />
                                    <span>{sub.phone}</span>
                                  </div>
                                )}
                              </div>

                              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 font-sans leading-relaxed whitespace-pre-wrap">
                                {sub.message}
                              </div>

                              <div className="text-[10px] text-slate-400 font-mono text-right">
                                {new Date(sub.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    admissions.length === 0 ? (
                      <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                        <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h5 className="font-serif text-sm font-bold text-slate-600 mb-1">
                          {language === "EN" ? "No Admissions Requests" : "Sin Solicitudes de Admisión"}
                        </h5>
                        <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto leading-relaxed">
                          {language === "EN"
                            ? "Applications will show here when parents submit the admissions interest form."
                            : "Las solicitudes enviadas por padres en el formulario de admisiones se registrarán en esta sección automáticamente."}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                        {admissions.map((adm) => (
                          <div
                            key={adm.id}
                            className="bg-white border border-slate-200 rounded-xl p-5 relative shadow-sm hover:shadow-md transition-shadow"
                          >
                            <button
                              onClick={() => handleDeleteSubmission(adm.id, "admissions")}
                              className="absolute top-5 right-5 p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
                              title={language === "EN" ? "Delete permanently" : "Eliminar permanentemente"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="pr-12 space-y-3">
                              <div className="flex flex-wrap items-baseline gap-2 justify-between">
                                <div className="flex flex-wrap items-baseline gap-2">
                                  <span className="font-serif font-bold text-base text-[#1B3A6B]">
                                    {adm.firstName} {adm.lastName}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-400">
                                    ID: {adm.id}
                                  </span>
                                </div>
                                <span className="bg-[#1B3A6B]/10 border border-[#1B3A6B]/30 text-[#1B3A6B] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                  {language === "EN" ? `Grade: ${adm.grade}` : `Grado: ${adm.grade}`}
                                </span>
                              </div>

                              <div className="grid sm:grid-cols-2 gap-2 text-xs font-mono text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3.5 h-3.5 text-[#C9A961] shrink-0" />
                                  <a href={`mailto:${adm.email}`} className="hover:underline text-slate-700">{adm.email}</a>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3.5 h-3.5 text-[#C9A961] shrink-0" />
                                  <span>{adm.phone}</span>
                                </div>
                              </div>

                              {adm.message && (
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 font-sans leading-relaxed whitespace-pre-wrap">
                                  {adm.message}
                                </div>
                              )}

                              <div className="text-[10px] text-slate-400 font-mono text-right">
                                {new Date(adm.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              ) : (
                /* Popup configuration */
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#1B3A6B]">
                      {language === "EN" ? "Welcome Popup Notice" : "Aviso Emergente de Inicio"}
                    </h4>
                    <p className="text-xs text-slate-500 font-sans mt-1">
                      {language === "EN" 
                        ? "Configure a promotional flyer or notice that appears when users visit the homepage." 
                        : "Configura un aviso o flyer promocional que aparecerá cuando los usuarios visiten el inicio."}
                    </p>
                  </div>

                  <form onSubmit={handleSavePopup} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                    {/* Enabled Toggle */}
                    <div className="flex items-center gap-3 p-4 bg-[#F8F6F1] border border-[#C9A961]/25 rounded-xl">
                      <input
                        type="checkbox"
                        checked={popupConfig.enabled}
                        onChange={(e) => setPopupConfig({ ...popupConfig, enabled: e.target.checked })}
                        className="w-4 h-4 text-[#1B3A6B] rounded border-slate-300"
                        id="popupEnabled"
                      />
                      <label htmlFor="popupEnabled" className="text-sm font-bold text-[#1B3A6B] cursor-pointer">
                        {language === "EN" ? "Enable Welcome Popup" : "Activar Aviso de Inicio"}
                      </label>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {/* Image Upload/Base64 */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-slate-600 font-bold flex justify-between">
                            <span>{language === "EN" ? "Flyer Image" : "Imagen del Aviso (Flyer)"}</span>
                          </label>
                          <div className="flex flex-col gap-2">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                <ImageIcon className="w-6 h-6 mb-2 text-slate-400" />
                                <p className="text-xs text-slate-500 font-semibold">{language === "EN" ? "Click to upload image" : "Clic para subir imagen"}</p>
                                <p className="text-[10px] text-slate-400 font-sans mt-1">JPG, PNG, GIF, WEBP</p>
                              </div>
                              <input 
                                type="file" 
                                accept="image/*"
                                className="hidden" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                      setPopupConfig({ ...popupConfig, imageBase64: e.target?.result as string });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }} 
                              />
                            </label>
                            
                            {popupConfig.imageBase64 && (
                              <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center p-2">
                                <img src={popupConfig.imageBase64} alt="Preview" className="max-h-40 object-contain" />
                                <button
                                  type="button"
                                  onClick={() => setPopupConfig({ ...popupConfig, imageBase64: "" })}
                                  className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                                  title={language === "EN" ? "Remove image" : "Quitar imagen"}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Link URL */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">
                            {language === "EN" ? "Destination Link (Optional)" : "Enlace de Destino (Opcional)"}
                          </label>
                          <input
                            type="url"
                            placeholder="https://..."
                            value={popupConfig.linkUrl}
                            onChange={(e) => setPopupConfig({ ...popupConfig, linkUrl: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-[#1B3A6B] rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                          />
                          <p className="text-[9px] text-slate-400 font-sans">
                            {language === "EN" ? "Where users go when they click the image" : "A dónde irán los usuarios al hacer clic en la imagen"}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {/* Start Date */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">
                              {language === "EN" ? "Start Date" : "Fecha de Inicio"}
                            </label>
                            <input
                              type="date"
                              value={popupConfig.startDate}
                              onChange={(e) => setPopupConfig({ ...popupConfig, startDate: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 focus:border-[#1B3A6B] rounded-xl px-3 py-2 text-sm focus:outline-none"
                            />
                          </div>

                          {/* End Date */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">
                              {language === "EN" ? "End Date" : "Fecha Final"}
                            </label>
                            <input
                              type="date"
                              value={popupConfig.endDate}
                              onChange={(e) => setPopupConfig({ ...popupConfig, endDate: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 focus:border-[#1B3A6B] rounded-xl px-3 py-2 text-sm focus:outline-none"
                            />
                          </div>
                        </div>
                        <p className="text-[9px] text-slate-400 font-sans mt-1">
                          {language === "EN" 
                            ? "Leave dates empty to show it always (if enabled)." 
                            : "Deje las fechas vacías para mostrarlo siempre (si está activo)."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                      <button
                        type="submit"
                        disabled={savingPopup}
                        className="px-6 py-2.5 bg-[#1B3A6B] hover:bg-[#0F2444] text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
                      >
                        {savingPopup ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{language === "EN" ? "Saving..." : "Guardando..."}</span>
                          </>
                        ) : popupSaveSuccess ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>{language === "EN" ? "Saved" : "Guardado"}</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>{language === "EN" ? "Save Config" : "Guardar Configuración"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
