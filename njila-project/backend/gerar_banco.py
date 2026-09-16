"""
gerar_banco.py - Plataforma Njila (alinhado ao MVP oficial)
Gera empresas + eventos simulados, classifica cada empresa nos 6 estados
da jornada descritos no documento do MVP, calcula o Score de prioridade
(com explicação em texto) e grava tudo em um banco SQLite único.
"""
import sqlite3
import random
from pathlib import Path
from datetime import datetime, timedelta

random.seed(7)
HOJE = datetime(2026, 9, 14, 9, 0, 0)
DB_PATH = Path(__file__).resolve().parent / "njila.db"

# ---------------------------------------------------------------
# 1. Dados fictícios de apoio
# ---------------------------------------------------------------
PREFIXOS = ["Norte", "Atlântica", "Global", "Sul", "Brasil", "Rio", "Costa",
            "Meridian", "Vale", "Aço", "Litoral", "Terra", "Mar", "Central",
            "União", "Prime", "Nova", "Delta", "Poço", "Bahia", "Metalúrgica"]
SUFIXOS = ["Engenharia", "Suprimentos", "Logística", "Serviços", "Indústria",
           "Equipamentos", "Soluções", "Materiais", "Offshore", "Tecnologia",
           "Comércio", "Construções", "Manutenção", "Transportes", "Horizonte"]
SEGMENTOS = ["Equipamentos de Perfuração", "Logística Offshore", "Manutenção Industrial",
             "TI e Software", "Materiais de Construção", "Consultoria Técnica",
             "Transporte de Cargas", "Segurança do Trabalho", "Engenharia Naval"]
OPORTUNIDADES = [f"70044{n:05d}" for n in range(10, 45)]  # ids de oportunidades fictícias

def gerar_cnpj_mascarado():
    n = lambda k: "".join(str(random.randint(0, 9)) for _ in range(k))
    return f"{n(2)}.{n(3)}.***/****-{n(2)}"

def gerar_nome(usados):
    while True:
        nome = f"{random.choice(PREFIXOS)} {random.choice(SUFIXOS)}"
        if nome not in usados:
            usados.add(nome)
            return nome

N_EMPRESAS = 60
usados = set()
empresas = []
for i in range(1, N_EMPRESAS + 1):
    empresas.append({
        "empresa_id": f"E{i:03d}",
        "nome_empresa": gerar_nome(usados),
        "cnpj_mascarado": gerar_cnpj_mascarado(),
        "segmento": random.choice(SEGMENTOS),
        "data_cadastro_portal": (HOJE - timedelta(days=random.randint(60, 900))).strftime("%Y-%m-%d"),
    })

# Distribuição proposital dos 6 estados oficiais do MVP (10 empresas cada)
ESTADOS_ALVO = (
    ["chegou_perdeu"] * 10 +
    ["parou_cadastro"] * 10 +
    ["quis_participar_travou"] * 10 +
    ["era_ativa_sumiu"] * 10 +
    ["oportunidade_quente"] * 10 +
    ["jornada_concluida"] * 10
)
random.shuffle(ESTADOS_ALVO)
for emp, estado in zip(empresas, ESTADOS_ALVO):
    emp["_estado_alvo"] = estado

PAGINAS = ["pagina_inicial", "oportunidades", "detalhe_oportunidade", "cadastro_fornecedor",
           "pagamento_taxa", "meus_processos", "tutorial", "suporte"]

eventos = []
def add_evento(empresa_id, ts, sessao, pagina, acao, oportunidade=None, status_etapa="em_andamento"):
    eventos.append({
        "evento_id": f"EV{len(eventos)+1:06d}",
        "empresa_id": empresa_id,
        "timestamp": ts.strftime("%Y-%m-%d %H:%M:%S"),
        "sessao_id": sessao,
        "pagina": pagina,
        "acao": acao,
        "oportunidade_id": oportunidade or "",
        "status_etapa": status_etapa,
    })

for emp in empresas:
    eid = emp["empresa_id"]
    estado = emp["_estado_alvo"]
    sessao = f"S-{eid}-1"

    if estado == "chegou_perdeu":
        ts = HOJE - timedelta(days=random.randint(8, 20), hours=random.randint(0, 12))
        add_evento(eid, ts, sessao, "pagina_inicial", "acessou_pagina_inicial")
        add_evento(eid, ts + timedelta(minutes=2), sessao, "oportunidades", "buscou_oportunidades")

    elif estado == "parou_cadastro":
        ts = HOJE - timedelta(days=random.randint(3, 10), hours=random.randint(0, 20))
        add_evento(eid, ts, sessao, "pagina_inicial", "acessou_pagina_inicial")
        add_evento(eid, ts + timedelta(minutes=3), sessao, "cadastro_fornecedor", "iniciou_cadastro",
                   status_etapa="abandonado")

    elif estado == "quis_participar_travou":
        op = random.choice(OPORTUNIDADES)
        ts = HOJE - timedelta(days=random.randint(2, 10), hours=random.randint(0, 20))
        add_evento(eid, ts, sessao, "oportunidades", "buscou_oportunidades")
        add_evento(eid, ts + timedelta(minutes=2), sessao, "detalhe_oportunidade", "abriu_oportunidade", op)
        add_evento(eid, ts + timedelta(minutes=4), sessao, "detalhe_oportunidade", "demonstrou_interesse", op)
        add_evento(eid, ts + timedelta(minutes=7), sessao, "pagamento_taxa", "iniciou_pagamento_taxa", op,
                   status_etapa="abandonado")

    elif estado == "era_ativa_sumiu":
        primeira = HOJE - timedelta(days=random.randint(70, 120))
        cursor = primeira
        for _ in range(random.randint(6, 9)):
            cursor += timedelta(days=random.randint(4, 9))
            if cursor > HOJE - timedelta(days=15):
                break
            add_evento(eid, cursor, f"S-{eid}-{cursor.day}", random.choice(PAGINAS), "acessou_pagina_inicial")
        ultimo = HOJE - timedelta(days=random.randint(15, 30))
        add_evento(eid, ultimo, f"S-{eid}-last", "meus_processos", "retornou_portal")

    elif estado == "oportunidade_quente":
        op = random.choice(OPORTUNIDADES)
        cursor = HOJE - timedelta(days=random.randint(10, 15))
        n_visitas = random.randint(4, 6)
        for k in range(n_visitas):
            cursor += timedelta(days=random.randint(1, 2))
            add_evento(eid, cursor, f"S-{eid}-{k}", "detalhe_oportunidade", "abriu_oportunidade", op)

    else:  # jornada_concluida
        op = random.choice(OPORTUNIDADES)
        ts = HOJE - timedelta(days=random.randint(3, 12))
        add_evento(eid, ts, sessao, "oportunidades", "buscou_oportunidades")
        add_evento(eid, ts + timedelta(minutes=2), sessao, "detalhe_oportunidade", "abriu_oportunidade", op)
        add_evento(eid, ts + timedelta(minutes=5), sessao, "detalhe_oportunidade", "demonstrou_interesse", op)
        add_evento(eid, ts + timedelta(minutes=9), sessao, "pagamento_taxa", "iniciou_pagamento_taxa", op)
        add_evento(eid, ts + timedelta(minutes=15), sessao, "pagamento_taxa", "concluiu_acao", op,
                   status_etapa="concluido")

for emp in empresas:
    del emp["_estado_alvo"]

eventos.sort(key=lambda e: e["timestamp"])

# ---------------------------------------------------------------
# 2. Classificação + Score explicado (regras do MVP)
# ---------------------------------------------------------------
ACAO_RECOMENDADA = {
    "chegou_perdeu": "Apresentar tutorial ou orientação inicial",
    "parou_cadastro": "Mostrar pendências e botão para continuar o cadastro",
    "quis_participar_travou": "Orientar sobre a etapa pendente ou encaminhar ao Atendimento",
    "era_ativa_sumiu": "Enviar comunicação de reengajamento",
    "oportunidade_quente": "Priorizar o contato ou enviar lembrete contextual",
    "jornada_concluida": "Não interromper; apenas registrar o sucesso",
}
PESO_ESTADO = {
    "quis_participar_travou": 40,
    "oportunidade_quente": 35,
    "era_ativa_sumiu": 30,
    "parou_cadastro": 20,
    "chegou_perdeu": 10,
    "jornada_concluida": 0,
}

def classificar(empresa_id):
    evs = [e for e in eventos if e["empresa_id"] == empresa_id]
    evs.sort(key=lambda e: e["timestamp"])
    if not evs:
        return None
    ts_list = [datetime.strptime(e["timestamp"], "%Y-%m-%d %H:%M:%S") for e in evs]
    acoes = [e["acao"] for e in evs]
    oportunidades = [e["oportunidade_id"] for e in evs if e["oportunidade_id"]]

    ultimo_acesso = max(ts_list)
    dias_desde_ultimo = (HOJE - ultimo_acesso).days

    concluiu = "concluiu_acao" in acoes
    iniciou_pagamento = "iniciou_pagamento_taxa" in acoes
    demonstrou_interesse = "demonstrou_interesse" in acoes
    iniciou_cadastro = "iniciou_cadastro" in acoes
    n_acessos = sum(1 for a in acoes if a in ("acessou_pagina_inicial", "retornou_portal"))

    # oportunidade mais repetida
    op_contagem = {}
    for op in oportunidades:
        op_contagem[op] = op_contagem.get(op, 0) + 1
    op_top = max(op_contagem, key=op_contagem.get) if op_contagem else None
    n_repeticoes = op_contagem.get(op_top, 0) if op_top else 0

    if concluiu:
        return "jornada_concluida", 0, op_top, n_repeticoes, \
            "A empresa avançou e concluiu a ação esperada."

    if iniciou_pagamento or demonstrou_interesse:
        ts_evento = max(t for t, a in zip(ts_list, acoes)
                         if a in ("iniciou_pagamento_taxa", "demonstrou_interesse"))
        dias_parado = (HOJE - ts_evento).days
        if dias_parado >= 1:
            return "quis_participar_travou", dias_parado, op_top, n_repeticoes, \
                f"Demonstrou interesse{' e iniciou o pagamento da taxa' if iniciou_pagamento else ''}, " \
                f"mas abandonou a etapa há {dias_parado} dia(s)."

    if n_repeticoes >= 4:
        return "oportunidade_quente", dias_desde_ultimo, op_top, n_repeticoes, \
            f"Visitou a mesma oportunidade {n_repeticoes} vezes nos últimos dias."

    if iniciou_cadastro:
        ts_evento = max(t for t, a in zip(ts_list, acoes) if a == "iniciou_cadastro")
        dias_parado = (HOJE - ts_evento).days
        if dias_parado * 24 >= 48:
            return "parou_cadastro", dias_parado, op_top, n_repeticoes, \
                f"Iniciou o cadastro e não concluiu há {dias_parado} dia(s)."

    if n_acessos >= 5 and dias_desde_ultimo >= 14:
        return "era_ativa_sumiu", dias_desde_ultimo, op_top, n_repeticoes, \
            f"Acessava com frequência e está há {dias_desde_ultimo} dias sem retornar."

    if n_acessos <= 2 and dias_desde_ultimo >= 7:
        return "chegou_perdeu", dias_desde_ultimo, op_top, n_repeticoes, \
            "Acessou o Portal, mas não avançou para uma ação relevante."

    return "jornada_concluida", dias_desde_ultimo, op_top, n_repeticoes, "Sem pendências no momento."


def calcular_score(estado, dias_parado, n_repeticoes, evidencia_base):
    score = PESO_ESTADO[estado]
    score += min(dias_parado, 30) * 2
    if n_repeticoes >= 4:
        score += 10
    score = max(0, min(100, score))
    explicacao = f"Prioridade: {score}/100 — {evidencia_base}"
    return score, explicacao


# ---------------------------------------------------------------
# 3. Gravar tudo no SQLite
# ---------------------------------------------------------------
conn = sqlite3.connect(DB_PATH)
conn.executescript("""
DROP TABLE IF EXISTS empresas;
DROP TABLE IF EXISTS eventos;
DROP TABLE IF EXISTS classificacao;
DROP TABLE IF EXISTS acoes_registradas;

CREATE TABLE empresas (
    empresa_id TEXT PRIMARY KEY,
    nome_empresa TEXT NOT NULL,
    cnpj_mascarado TEXT,
    segmento TEXT,
    data_cadastro_portal TEXT
);

CREATE TABLE eventos (
    evento_id TEXT PRIMARY KEY,
    empresa_id TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    sessao_id TEXT,
    pagina TEXT,
    acao TEXT,
    oportunidade_id TEXT,
    status_etapa TEXT,
    FOREIGN KEY (empresa_id) REFERENCES empresas(empresa_id)
);

CREATE TABLE classificacao (
    empresa_id TEXT PRIMARY KEY,
    momento TEXT NOT NULL,
    score INTEGER,
    score_explicacao TEXT,
    dias_parado INTEGER,
    oportunidade_relacionada TEXT,
    n_repeticoes_oportunidade INTEGER,
    acao_recomendada TEXT,
    ultimo_acesso TEXT,
    atualizado_em TEXT,
    FOREIGN KEY (empresa_id) REFERENCES empresas(empresa_id)
);

CREATE TABLE acoes_registradas (
    acao_id INTEGER PRIMARY KEY AUTOINCREMENT,
    empresa_id TEXT NOT NULL,
    momento_no_momento TEXT,
    tipo_acao TEXT NOT NULL,
    canal TEXT,
    mensagem_enviada TEXT,
    registrado_em TEXT NOT NULL,
    empresa_retornou INTEGER DEFAULT 0,
    empresa_concluiu INTEGER DEFAULT 0,
    FOREIGN KEY (empresa_id) REFERENCES empresas(empresa_id)
);
""")

conn.executemany(
    "INSERT INTO empresas VALUES (:empresa_id, :nome_empresa, :cnpj_mascarado, :segmento, :data_cadastro_portal)",
    empresas,
)
conn.executemany(
    "INSERT INTO eventos VALUES (:evento_id, :empresa_id, :timestamp, :sessao_id, :pagina, :acao, :oportunidade_id, :status_etapa)",
    eventos,
)

agora = HOJE.strftime("%Y-%m-%d %H:%M:%S")
for emp in empresas:
    resultado = classificar(emp["empresa_id"])
    if resultado is None:
        continue
    estado, dias_parado, op_top, n_rep, evidencia = resultado
    score, explicacao = calcular_score(estado, dias_parado, n_rep, evidencia)

    ev_empresa = [e for e in eventos if e["empresa_id"] == emp["empresa_id"]]
    ultimo_acesso = max(e["timestamp"] for e in ev_empresa)

    conn.execute(
        """INSERT INTO classificacao
           (empresa_id, momento, score, score_explicacao, dias_parado,
            oportunidade_relacionada, n_repeticoes_oportunidade, acao_recomendada,
            ultimo_acesso, atualizado_em)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (emp["empresa_id"], estado, score, explicacao, dias_parado,
         op_top, n_rep, ACAO_RECOMENDADA[estado], ultimo_acesso, agora),
    )

# 2 ações de exemplo já registradas (para a Ficha ter histórico)
exemplos = conn.execute(
    "SELECT empresa_id, momento FROM classificacao WHERE momento != 'jornada_concluida' LIMIT 2"
).fetchall()
for empresa_id, momento in exemplos:
    conn.execute(
        """INSERT INTO acoes_registradas
           (empresa_id, momento_no_momento, tipo_acao, canal, mensagem_enviada, registrado_em, empresa_retornou, empresa_concluiu)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
        (empresa_id, momento, "enviar_tutorial", "email",
         "Enviamos um tutorial explicando o próximo passo.", agora, 0, 0),
    )

conn.commit()

n_emp = conn.execute("SELECT COUNT(*) FROM empresas").fetchone()[0]
n_ev = conn.execute("SELECT COUNT(*) FROM eventos").fetchone()[0]
print(f"Banco criado: {n_emp} empresas, {n_ev} eventos")
print("\nDistribuição por momento da jornada:")
for row in conn.execute("SELECT momento, COUNT(*) FROM classificacao GROUP BY momento"):
    print(f"  {row[0]}: {row[1]}")
conn.close()
