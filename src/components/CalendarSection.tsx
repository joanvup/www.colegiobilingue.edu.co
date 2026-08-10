import { useState, useEffect } from "react";
import { useLanguage } from "../i18n";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Clock, RefreshCw, AlertTriangle, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: string; // ISO string or Date string
  end: string;
  allDay: boolean;
  location?: string;
}

export default function CalendarSection() {
  const { language, t } = useLanguage();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMock, setIsMock] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isPrivateOrNotFound, setIsPrivateOrNotFound] = useState<boolean>(false);

  // Fetch events on component load and month change
  const fetchEvents = async () => {
    setLoading(true);
    setError(false);
    setIsPrivateOrNotFound(false);
    try {
      // We can fetch a wider range of events to be safe (e.g. 2 months before/after)
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const timeMin = new Date(year, month - 1, 1).toISOString();
      const timeMax = new Date(year, month + 2, 0).toISOString();

      const response = await fetch(`/api/calendar/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data.events || []);
      setIsMock(data.isMock === true);
      setIsPrivateOrNotFound(data.isPrivateOrNotFound === true);
      if (data.statusError) {
        setError(true);
      }
    } catch (err: any) {
      console.warn("Google Calendar fetch issue:", err?.message || err);
      setError(true);
      setIsMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Names of months based on active language
  const monthNamesES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const monthNamesEN = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = language === "ES" ? monthNamesES[month] : monthNamesEN[month];

  // Week days starting on Sunday (0) to match firstDayOfMonth
  const weekDaysES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const weekDaysEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekDays = language === "ES" ? weekDaysES : weekDaysEN;

  // Generate days to fill the calendar grid
  const gridCells = [];
  
  // Fill empty spots of previous month
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    gridCells.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevMonthDays - i)
    });
  }

  // Fill current month days
  for (let i = 1; i <= daysInMonth; i++) {
    gridCells.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i)
    });
  }

  // Fill remaining spaces for trailing next month days
  const remainingCells = 42 - gridCells.length; // standard 6-row grid
  for (let i = 1; i <= remainingCells; i++) {
    gridCells.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i)
    });
  }

  // Helper function to calculate precise start & end dates in local time
  const getEventDateRange = (event: CalendarEvent) => {
    let startDate: Date;
    let endDate: Date;

    const parseYMD = (str: string) => {
      if (!str) return null;
      const ymd = str.split("T")[0].split("-");
      if (ymd.length === 3) {
        const y = parseInt(ymd[0], 10);
        const m = parseInt(ymd[1], 10) - 1;
        const d = parseInt(ymd[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          return { year: y, month: m, day: d };
        }
      }
      return null;
    };

    const isDateOnlyString =
      typeof event.start === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(event.start.split("T")[0]) &&
      !event.start.includes("T");

    if (event.allDay || isDateOnlyString) {
      const startYMD = parseYMD(event.start);
      if (startYMD) {
        startDate = new Date(startYMD.year, startYMD.month, startYMD.day, 0, 0, 0);
      } else {
        const raw = new Date(event.start);
        startDate = new Date(raw.getFullYear(), raw.getMonth(), raw.getDate(), 0, 0, 0);
      }

      if (event.end) {
        const endYMD = parseYMD(event.end);
        if (endYMD) {
          // Google Calendar all-day event end date is EXCLUSIVE.
          // E.g., a 1-day event on Aug 13 has start="2026-08-13" and end="2026-08-14".
          // Subtract 1 day if end date is after start date.
          const endRaw = new Date(endYMD.year, endYMD.month, endYMD.day, 0, 0, 0);
          if (endRaw > startDate) {
            endRaw.setDate(endRaw.getDate() - 1);
          }
          endDate = new Date(endRaw.getFullYear(), endRaw.getMonth(), endRaw.getDate(), 23, 59, 59);
        } else {
          endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 23, 59, 59);
        }
      } else {
        endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 23, 59, 59);
      }
    } else {
      // Timed event (e.g. ISO string with time)
      const s = new Date(event.start);
      startDate = new Date(s.getFullYear(), s.getMonth(), s.getDate(), 0, 0, 0);

      if (event.end) {
        const e = new Date(event.end);
        endDate = new Date(e.getFullYear(), e.getMonth(), e.getDate(), 23, 59, 59);
      } else {
        endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 23, 59, 59);
      }
    }

    return { startDate, endDate };
  };

  // Helper to compare dates ignoring time
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  // Filter events that fall on a specific date
  const getEventsForDay = (date: Date) => {
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);

    return events.filter((event) => {
      const { startDate, endDate } = getEventDateRange(event);
      return targetDate >= startDate && targetDate <= endDate;
    });
  };

  // Change month handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Selected day events
  const selectedDayEvents = getEventsForDay(selectedDate);

  // Filter all events in the currently viewed month
  const currentMonthEvents = events.filter(event => {
    const { startDate } = getEventDateRange(event);
    return startDate.getMonth() === month && startDate.getFullYear() === year;
  });

  return (
    <section
      id="calendar"
      className="py-24 bg-[#FAF9F5] border-b border-[#1B3A6B]/10 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2.5 mx-auto w-fit px-4 py-1.5 rounded-full border border-[#C9A961]/30 bg-[#C9A961]/5 text-xs font-bold tracking-widest text-[#1B3A6B] uppercase mb-4"
          >
            <CalendarIcon className="w-4 h-4 text-[#C9A961]" />
            <span>{language === "ES" ? "Vida Escolar" : "Campus Life"}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-bold text-[#1B3A6B] tracking-wide mb-6"
          >
            {t("calendar.title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 leading-relaxed text-sm md:text-base font-serif"
          >
            {t("calendar.subtitle")}
          </motion.p>
        </div>

        {/* Sync Status Banner */}
        <div className="max-w-6xl mx-auto mb-8 flex flex-wrap gap-3 items-center justify-between bg-white px-5 py-3 rounded-2xl border border-stone-200/60 shadow-sm text-xs">
          <div className="flex items-center gap-2">
            {isPrivateOrNotFound ? (
              <>
                <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-semibold text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  {language === "ES"
                    ? "Calendario privado o no encontrado"
                    : "Calendar is private or not found"}
                </span>
                <span className="text-[#1A1A1A]/40 hidden md:inline">|</span>
                <span className="text-gray-500 hidden md:inline">
                  {t("calendar.fallbackMock")}
                </span>
              </>
            ) : error ? (
              <>
                <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-semibold text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {t("calendar.errorSync")}
                </span>
                <span className="text-[#1A1A1A]/40 hidden md:inline">|</span>
                <span className="text-gray-500 hidden md:inline">
                  {t("calendar.fallbackMock")}
                </span>
              </>
            ) : isMock ? (
              <>
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-semibold text-amber-700">
                  {language === "ES" ? "Calendario Institucional Local" : "Local Institutional Calendar"}
                </span>
                <span className="text-[#1A1A1A]/40 hidden md:inline">|</span>
                <span className="text-gray-500 hidden md:inline">
                  {t("calendar.fallbackMock")}
                </span>
              </>
            ) : (
              <>
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {t("calendar.syncedWithGoogle")}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchEvents}
              disabled={loading}
              className="flex items-center gap-1.5 px-2.5 py-1 text-gray-600 hover:text-[#1B3A6B] hover:bg-gray-100 rounded-lg transition-all font-semibold cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>{language === "ES" ? "Sincronizar" : "Sync Now"}</span>
            </button>
          </div>
        </div>

        {isPrivateOrNotFound && (
          <div className="max-w-6xl mx-auto mb-8 p-5 bg-[#FAF3E0] border border-[#C9A961]/40 rounded-2xl text-xs text-[#5C4D3C] leading-relaxed font-sans shadow-sm">
            <h5 className="font-bold flex items-center gap-2 mb-2 text-[#1B3A6B] text-sm">
              <AlertTriangle className="w-4 h-4 text-[#C9A961]" />
              <span>
                {language === "ES"
                  ? "Guía de Sincronización: El calendario debe ser Público"
                  : "Sync Guide: Calendar must be Public"}
              </span>
            </h5>
            <p className="mb-3">
              {language === "ES"
                ? "El calendario se encuentra guardado en el servidor, pero la API de Google retorna un error (No Encontrado) debido a que el calendario no tiene activados los permisos de acceso público. Por favor, siga estos pasos para sincronizarlo correctamente:"
                : "The calendar is stored on the server, but the Google API returns a Not Found error because public access permissions are disabled. Please follow these steps to sync correctly:"}
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-1 font-medium text-[#1A1A1A]/80">
              <li>
                {language === "ES"
                  ? "Inicie sesión en Google Calendar desde un navegador web."
                  : "Log into Google Calendar from a web browser."}
              </li>
              <li>
                {language === "ES"
                  ? "En la barra lateral izquierda, bajo 'Mis calendarios', ubique el calendario correspondiente, haga clic en los 3 puntos verticales y seleccione 'Configuración y compartir'."
                  : "In the left sidebar under 'My calendars', find the respective calendar, click the 3 vertical dots, and select 'Settings and sharing'."}
              </li>
              <li>
                {language === "ES"
                  ? "Desplácese hasta la sección 'Permisos de acceso para eventos' y marque la casilla 'Compartir de forma pública'."
                  : "Scroll down to 'Access permissions for events' and check the 'Make available to public' box."}
              </li>
              <li>
                {language === "ES"
                  ? "En el menú desplegable a la derecha de esa opción, asegúrese de seleccionar 'Ver todos los detalles de los eventos' (o al menos 'Ver solo libre/ocupado')."
                  : "In the dropdown menu to the right of that option, ensure 'See all event details' (or at least 'See only free/busy') is selected."}
              </li>
              <li>
                {language === "ES"
                  ? "Regrese a esta página y haga clic en el botón 'Sincronizar' arriba para actualizar."
                  : "Return to this page and click the 'Sync Now' button above to refresh."}
              </li>
            </ol>
          </div>
        )}

        {/* Calendar Core Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl border border-stone-200/80 shadow-md overflow-hidden">
          
          {/* LEFT: Grid View (Cols 7) */}
          <div className="lg:col-span-7 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-stone-100">
            
            {/* Header controls */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-xl md:text-2xl font-bold text-[#1B3A6B]">
                  {monthName} <span className="font-sans text-gray-400 font-normal">{year}</span>
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleToday}
                  className="px-3 py-1.5 text-xs font-semibold text-[#1B3A6B] bg-[#1B3A6B]/5 hover:bg-[#1B3A6B]/10 rounded-lg transition-all cursor-pointer border border-[#1B3A6B]/10"
                >
                  {language === "ES" ? "Hoy" : "Today"}
                </button>
                <button
                  onClick={handlePrevMonth}
                  className="p-2 text-gray-600 hover:text-[#1B3A6B] hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                  title="Mes Anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 text-gray-600 hover:text-[#1B3A6B] hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                  title="Siguiente Mes"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {weekDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`text-xs font-bold py-2 uppercase tracking-wider ${
                    idx === 0 || idx === 6 ? "text-amber-600/80" : "text-gray-500"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Monthly Day Grid */}
            <div className="grid grid-cols-7 gap-1.5 md:gap-2">
              {loading ? (
                // Loading Placeholder Grid
                Array.from({ length: 35 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="aspect-square bg-gray-50 rounded-xl animate-pulse"
                  />
                ))
              ) : (
                gridCells.map((cell, idx) => {
                  const dayEvents = getEventsForDay(cell.date);
                  const isToday = isSameDay(cell.date, new Date());
                  const isSelected = isSameDay(cell.date, selectedDate);
                  const hasEvents = dayEvents.length > 0;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(cell.date)}
                      className={`aspect-square relative flex flex-col justify-between p-1.5 md:p-2.5 rounded-2xl transition-all duration-200 cursor-pointer group border ${
                        cell.isCurrentMonth
                          ? "bg-white border-transparent text-[#1A1A1A]"
                          : "bg-stone-50/50 border-transparent text-gray-400"
                      } ${
                        isSelected
                          ? "ring-2 ring-[#C9A961] bg-[#C9A961]/10 border-transparent z-10"
                          : "hover:bg-stone-100/70 hover:border-stone-200"
                      }`}
                    >
                      {/* Day number */}
                      <span
                        className={`text-xs md:text-sm font-semibold flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                          isToday
                            ? "bg-[#1B3A6B] text-white font-bold"
                            : isSelected
                            ? "text-[#1B3A6B] font-bold"
                            : "text-gray-700"
                        }`}
                      >
                        {cell.day}
                      </span>

                      {/* Event indicators dots/stripes */}
                      <div className="flex flex-col gap-0.5 w-full mt-1">
                        {hasEvents && (
                          <div className="hidden md:block overflow-hidden max-h-[14px]">
                            {dayEvents.slice(0, 2).map((ev, evIdx) => (
                              <div
                                key={evIdx}
                                className="text-[9px] leading-3 truncate px-1 rounded bg-[#1B3A6B]/10 text-[#1B3A6B] border-l-2 border-[#C9A961] mb-0.5 font-sans"
                              >
                                {ev.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-[8px] text-gray-400 text-right pr-1">
                                +{dayEvents.length - 2}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Mobile view dots indicator */}
                        {hasEvents && (
                          <div className="flex items-center justify-center gap-1 md:hidden">
                            <span className="h-1 w-1 rounded-full bg-[#C9A961]" />
                            {dayEvents.length > 1 && <span className="h-1 w-1 rounded-full bg-[#1B3A6B]" />}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT: Selected Day Agenda (Cols 5) */}
          <div className="lg:col-span-5 bg-stone-50/75 p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Day title info */}
              <div className="border-b border-stone-200/60 pb-5 mb-6">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A961]">
                  {language === "ES" ? "Detalle de Agenda" : "Agenda Details"}
                </span>
                <h4 className="font-cinzel text-lg md:text-xl font-bold text-[#1B3A6B] mt-1">
                  {selectedDate.toLocaleDateString(language === "ES" ? "es-CO" : "en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </h4>
              </div>

              {/* Events list container */}
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedDayEvents.length > 0 ? (
                  selectedDayEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white p-4.5 rounded-2xl border border-stone-200/50 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <h5 className="font-sans text-sm font-bold text-[#1B3A6B] leading-snug">
                        {event.title}
                      </h5>
                      
                      {event.description && (
                        <p className="text-xs text-gray-600 mt-2 font-serif leading-relaxed line-clamp-3">
                          {event.description}
                        </p>
                      )}

                      <div className="flex flex-col gap-1.5 mt-4 text-[11px] text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#C9A961]" />
                          <span>
                            {event.allDay
                              ? (language === "ES" ? "Todo el día" : "All day")
                              : new Date(event.start).toLocaleTimeString(language === "ES" ? "es-CO" : "en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                }) + " - " + new Date(event.end).toLocaleTimeString(language === "ES" ? "es-CO" : "en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })
                            }
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#C9A961]" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 px-4">
                    <CalendarIcon className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                    <p className="text-xs text-gray-500 font-serif leading-relaxed">
                      {t("calendar.noEvents")}
                    </p>
                    <button
                      onClick={() => {
                        // Select first day of this month that has events
                        const firstWithEvents = gridCells.find(cell => cell.isCurrentMonth && getEventsForDay(cell.date).length > 0);
                        if (firstWithEvents) {
                          setSelectedDate(firstWithEvents.date);
                        }
                      }}
                      className="text-[11px] text-[#1B3A6B] hover:text-[#C9A961] underline font-bold mt-2 cursor-pointer block mx-auto"
                    >
                      {language === "ES" ? "Buscar día con actividades" : "Find day with activities"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Month overview toggle / list count */}
            <div className="border-t border-stone-200/60 pt-5 mt-6 text-xs text-gray-500 flex items-center justify-between">
              <span>
                {language === "ES"
                  ? `${currentMonthEvents.length} actividades en ${monthName}`
                  : `${currentMonthEvents.length} activities in ${monthName}`
                }
              </span>
              <button
                onClick={() => {
                  // Prompt showing the list of all events
                  const fullMonthText = currentMonthEvents.map(e => {
                    const { startDate } = getEventDateRange(e);
                    const d = startDate.getDate();
                    return `• [Día ${d}] ${e.title}`;
                  }).join("\n");
                  alert(
                    (language === "ES" ? `Actividades de ${monthName}:\n\n` : `Activities for ${monthName}:\n\n`) +
                    (fullMonthText || (language === "ES" ? "No hay actividades registradas." : "No registered activities."))
                  );
                }}
                className="text-[#1B3A6B] hover:text-[#C9A961] font-bold cursor-pointer"
              >
                {language === "ES" ? "Ver lista completa" : "View complete list"}
              </button>
            </div>
          </div>

        </div>

        {/* Sync/API Instruction notice for admins */}
        <div className="max-w-6xl mx-auto mt-6 text-center text-[10px] text-gray-400 font-serif">
          <span>* {t("calendar.configureAdmin")}</span>
        </div>

      </div>
    </section>
  );
}
