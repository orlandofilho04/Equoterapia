import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "./FloatCard.css";

function FloatCard({ sessions, onClose }) {
    return (
        <div className="floating-card-overlay">
            <div className="floating-card-container">
                <Button variant="danger" size="sm" onClick={onClose} className="close-btn">
                    Fechar
                </Button>
                <h5 className="mb-3">Sessões do paciente: {sessions[0]?.pacient?.name}</h5>
                {sessions.map((session) => (
                    <Card key={session.id} className="mb-2">
                        <Card.Body>
                            <Card.Title>{new Date(session.sessionHour).toLocaleString()}</Card.Title>
                            <Card.Text>Status: {session.sessionStatus}</Card.Text>
                            <Card.Text>Cavalo: {session.horse.name}</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default FloatCard;
