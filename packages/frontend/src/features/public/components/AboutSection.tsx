import { Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function AboutSection() {
  return (
    <div
      style={{
        padding: "60px 24px",
        maxWidth: 900,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <Title level={2} style={{ color: "#3E2723", marginBottom: 24 }}>
        Pedagogia Waldorf
      </Title>
      <Paragraph style={{ fontSize: 16, color: "#3E2723", lineHeight: 1.8 }}>
        A pedagogia Waldorf valoriza o desenvolvimento integral da criança,
        trabalhando de forma harmoniosa os aspectos físicos, emocionais,
        intelectuais e espirituais em cada fase do crescimento.
      </Paragraph>
      <Paragraph style={{ fontSize: 16, color: "#3E2723", lineHeight: 1.8 }}>
        Nossa proposta educacional baseia-se no respeito ao ritmo individual de
        cada criança, promovendo um ambiente acolhedor onde o aprendizado
        acontece de forma natural e alegre, através do brincar livre, das artes
        e do contato com a natureza.
      </Paragraph>
      <Paragraph style={{ fontSize: 16, color: "#3E2723", lineHeight: 1.8 }}>
        Convidamos você a conhecer nossa escola e vivenciar essa experiência
        educacional transformadora.
      </Paragraph>
      <div style={{ marginTop: 32 }}>
        <a
          href="https://www.escolaangelim.com.br"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 16, color: "#5B8C5A", fontWeight: 500 }}
        >
          Saiba mais sobre a Escola Angelim →
        </a>
      </div>
    </div>
  );
}
