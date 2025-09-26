import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Toast,
  ToastContainer,
  Spinner,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import "./newAgenda.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
// AJUSTE: Importar parseISO para garantir a interpretação correta da data
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

function NewAgenda() {
  // ... (todo o seu state e useEffects permanecem iguais) ...
  const navigate = useNavigate();
  const [professional_id, setProfessionalId] = useState(null);
  const [pacients, setPacients] = useState([]);
  const [selectedPacientId, setSelectedPacientId] = useState("");
  const [horsers, setHorses] = useState([]);
  const [selectedHorseId, setSelectedHorseId] = useState("");
  const [equitors, setEquitors] = useState([]);
  const [selectedEquitorId, setSelectedEquitorId] = useState("");
  const [mediators, setMediators] = useState([]);
  const [selectedMediatorId, setSelectedMediatorId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessions, setSessions] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [dateError, setDateError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get("/sessions");
        setSessions(response.data);
      } catch (error) {
        console.error("Erro ao buscar sessões:", error);
      }
    };
    fetchSessions();
  }, []);

  useEffect(() => {
    if (username) {
      api
        .get("/professional/?username=" + username)
        .then((response) => setProfessionalId(response.data.id))
        .catch((error) => console.error("Erro ao buscar profissional:", error));
    }
  }, [username]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, eRes, hRes, mRes] = await Promise.all([
          api.get("/pacients"),
          api.get("/professional/role?role=EQUITADOR"),
          api.get("/horses"),
          api.get("/professional/role?role=MEDIADOR"),
        ]);
        setPacients(pRes.data);
        setEquitors(eRes.data);
        setHorses(hRes.data);
        setMediators(mRes.data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };
    fetchData();
  }, []);

  const handleAgendamento = async (event) => {
    event.preventDefault();
    const sessionData = {
      sessionHour: `${selectedDate}T${selectedTime}:00`,
      duration: "01:00:00",
      sessionStatus: "AGENDADA",
    };
    const params = new URLSearchParams({
      pacient_id: selectedPacientId,
      horse_id: selectedHorseId,
      professional_id: professional_id,
      equitor_id: selectedEquitorId,
      mediator_id: selectedMediatorId,
    }).toString();
    setIsSubmitting(true);
    try {
      await api.post(`/sessions/registerSession?${params}`, sessionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/agenda-geral");
      }, 2000);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectPacient = (event) =>
    setSelectedPacientId(Number(event.target.value));
  const handleSelectEquitor = (event) =>
    setSelectedEquitorId(Number(event.target.value));
  const handleSelectHorse = (event) =>
    setSelectedHorseId(Number(event.target.value));
  const handleSelectMediator = (event) =>
    setSelectedMediatorId(Number(event.target.value));

  const getAvailableHours = () => {
    if (!selectedDate) return [];
    const busyHours = sessions
      .filter((s) => s.sessionHour.startsWith(selectedDate))
      .map((s) => new Date(s.sessionHour).getHours());
    const hours = [];
    for (let h = 7; h <= 16; h++) {
      if (!busyHours.includes(h)) {
        const hour = h.toString().padStart(2, "0");
        hours.push(`${hour}:00`);
      }
    }
    return hours;
  };

  const getSelectedName = (id, list) =>
    list.find((item) => item.id === id)?.name || "Aguardando seleção...";

  return (
    <div className="container my-5 p-4 rounded shadow bg-white">
      {showSuccess}
      <div className="agendamento mb-4">Novo Agendamento</div>
      <Row>
        <Col md={7}>
          <Form className="mx-2 mx-md-4 form" onSubmit={handleAgendamento}>
            {/* ... Seus Form.Groups ... */}
            <Row className="mb-3">
              <Form.Group
                as={Col}
                xs={12}
                sm={6}
                md={4}
                controlId="formGridPraticante"
                className="mb-3"
              >
                <Form.Label>Praticante</Form.Label>
                <Form.Select
                  value={selectedPacientId}
                  onChange={handleSelectPacient}
                >
                  <option value="" disabled>
                    Selecione um Praticante
                  </option>
                  {pacients
                    .filter((p) => p.status === "ATIVO")
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
              <Form.Group
                as={Col}
                xs={12}
                sm={6}
                md={4}
                controlId="formGridDatas"
                className="mb-3"
              >
                <Form.Label>Data</Form.Label>
                <Form.Control
                  type="date"
                  value={selectedDate}
                  min={localDate}
                  onChange={(e) => {
                    const inputDate = e.target.value;
                    const selected = parseISO(inputDate); // Usar parseISO aqui também
                    const day = selected.getDay();
                    if (day === 5 || day === 6) {
                      // Sábado (6) ou Domingo (0) no JS Date
                      setDateError("Fins de semana não são permitidos.");
                      setSelectedDate("");
                      return;
                    }
                    setDateError("");
                    setSelectedDate(inputDate);
                  }}
                />
                {dateError && (
                  <Form.Text className="text-danger">{dateError}</Form.Text>
                )}
              </Form.Group>
              <Form.Group
                as={Col}
                xs={12}
                md={4}
                controlId="formGridHorarios"
                className="mb-3"
              >
                <Form.Label>Horários</Form.Label>
                <Form.Select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  disabled={!selectedDate}
                >
                  <option value="" disabled>
                    Selecione um Horário
                  </option>
                  {getAvailableHours().map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group
                as={Col}
                xs={12}
                md={4}
                className="mb-3"
                controlId="formGridEquitor"
              >
                <Form.Label>Equitador</Form.Label>
                <Form.Select
                  value={selectedEquitorId}
                  onChange={handleSelectEquitor}
                >
                  <option value="" disabled>
                    Selecione um Equitador
                  </option>
                  {equitors.map((equitor) => (
                    <option key={equitor.id} value={equitor.id}>
                      {equitor.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group
                as={Col}
                xs={12}
                md={4}
                controlId="formGridCavalo"
                className="mb-3"
              >
                <Form.Label>Cavalo</Form.Label>
                <Form.Select
                  value={selectedHorseId}
                  onChange={handleSelectHorse}
                >
                  <option value="" disabled>
                    Selecione um Animal
                  </option>
                  {horsers
                    .filter((horse) => horse.status === "ATIVO")
                    .map((horse) => (
                      <option key={horse.id} value={horse.id}>
                        {horse.name}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
              <Form.Group
                as={Col}
                xs={12}
                md={4}
                controlId="formGridMediator"
                className="mb-3"
              >
                <Form.Label>Mediador</Form.Label>
                <Form.Select
                  value={selectedMediatorId}
                  onChange={handleSelectMediator}
                >
                  <option value="" disabled>
                    Selecione um Mediador
                  </option>
                  {mediators.map((mediator) => (
                    <option key={mediator.id} value={mediator.id}>
                      {mediator.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group controlId="formGridObs" className="mb-3">
                <Form.Label>Observações para a sessão</Form.Label>
                <Form.Control
                  placeholder="Observações gerais..."
                  as="textarea"
                  rows={5}
                />
              </Form.Group>
            </Row>
            <Row className="mt-3">
              <div className="d-flex justify-content-end flex-wrap">
                <Link
                  to="/agenda-geral"
                  className="btnB btn mx-2"
                  aria-pressed="true"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  className="btnA btn mx-2"
                  disabled={
                    !selectedPacientId ||
                    !selectedHorseId ||
                    !selectedEquitorId ||
                    !selectedMediatorId ||
                    !selectedDate ||
                    !selectedTime ||
                    isSubmitting
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Agendando...
                    </>
                  ) : (
                    "Agendar nova sessão"
                  )}
                </button>
              </div>
            </Row>
          </Form>
        </Col>
        <Col md={5}>
          <div className="summary-card">
            <h4>Resumo do Agendamento</h4>
            <div className="summary-item">
              <strong>Praticante:</strong>{" "}
              {getSelectedName(selectedPacientId, pacients)}
            </div>
            <div className="summary-item">
              <strong>Data:</strong> {/* CORREÇÃO APLICADA AQUI */}
              {selectedDate
                ? format(parseISO(selectedDate), "dd/MM/yyyy", { locale: ptBR })
                : "..."}
            </div>
            <div className="summary-item">
              <strong>Horário:</strong> {selectedTime || "..."}
            </div>
            <hr />
            <div className="summary-item">
              <strong>Equitador:</strong>{" "}
              {getSelectedName(selectedEquitorId, equitors)}
            </div>
            <div className="summary-item">
              <strong>Mediador:</strong>{" "}
              {getSelectedName(selectedMediatorId, mediators)}
            </div>
            <div className="summary-item">
              <strong>Cavalo:</strong>{" "}
              {getSelectedName(selectedHorseId, horsers)}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default NewAgenda;
