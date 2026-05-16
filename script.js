const appContent = document.getElementById('app-content');
const deviceFrame = document.querySelector('.device-frame');
const externalVoice = document.getElementById('external-voice');
const userVoice = document.getElementById('user-voice');
const simulationPanel = document.getElementById('simulation-panel');

const state = {
    currentScreen: 'home',
    aiMode: false,
    agentMode: false,
    lastScrollTime: 0,
    user: {
        name: '우리 고객',
        balance: '12,450,000',
        riskProfile: '공격투자형'
    },
    investment: {
        name: '우리 글로벌 테크 액티브 펀드',
        risk: '매우높은위험',
        type: '주식형 / 개방형',
        fee: '연 1.2% (선취 0.5%)'
    }
};

function renderScreen(screenName) {
    state.currentScreen = screenName;
    let html = '';

    updateSessionUI();

    switch(screenName) {
        case 'home':
            html = `
                <div class="screen" style="padding-top: 50px;">
                    <div class="header" style="margin-bottom: 20px;">
                        <img src="logo.png" style="width:90px;">
                        <div style="font-size: 18px;">🔔</div>
                    </div>
                    <div class="balance-card" style="margin-bottom: 25px;">
                        <h3 style="font-size:13px; color:var(--text-sub); margin-bottom:8px;">안녕하세요, ${state.user.name}님</h3>
                        <div style="font-size:26px; font-weight:700; color:var(--text-main);">${state.user.balance} 원</div>
                        <p style="font-size: 12px; color: var(--woori-blue); margin-top: 10px; font-weight:600;">내 투자 성향: ${state.user.riskProfile}</p>
                    </div>

                    <div class="quick-menu">
                        <div class="menu-item"><div class="menu-icon-box">📊</div><span>내자산</span></div>
                        <div class="menu-item"><div class="menu-icon-box">📈</div><span>펀드찾기</span></div>
                        <div class="menu-item" onclick="renderScreen('investDetail')"><div class="menu-icon-box" style="background:var(--woori-light-blue);">🔥</div><span>추천상품</span></div>
                        <div class="menu-item"><div class="menu-icon-box">💼</div><span>연금</span></div>
                    </div>

                    <div class="banner" style="background-image: url('fund_banner.png'); background-size: cover; border-radius: 18px; height: 160px; display: flex; align-items: flex-end; padding: 20px; cursor: pointer; border: 1px solid rgba(0,0,0,0.05);" onclick="renderScreen('investDetail')">
                        <div class="banner-content">
                            <span class="risk-badge risk-very-high" style="font-size:10px;">매우높은위험</span>
                            <h4 style="color:white; margin-top:5px; font-size:18px;">글로벌 테크 액티브</h4>
                            <p style="color:rgba(255,255,255,0.9); font-size:12px;">최근 1년 수익률 +34.2%</p>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'investDetail':
            html = `
                <div class="screen" style="padding-top: 80px;">
                    <div class="header" onclick="renderScreen('home')" style="margin-bottom: 15px;">
                        <span style="font-size: 14px; color: var(--text-sub);">← 뒤로</span>
                    </div>
                    <span class="risk-badge risk-very-high">${state.investment.risk}</span>
                    <h2 style="font-size: 24px; margin-bottom: 15px; color: var(--text-main);">${state.investment.name}</h2>
                    
                    <div class="balance-card" style="padding: 15px; margin-bottom: 20px;">
                        <p style="font-size: 13px; color: var(--text-sub); line-height: 1.6;">
                            본 펀드는 전 세계 혁신 기술주에 집중 투자하여 시장 대비 높은 초과 수익을 목표로 합니다.
                        </p>
                    </div>
                    <button class="btn-primary" onclick="renderScreen('aiPrompt')">가입하기</button>
                </div>
            `;
            break;

        case 'aiPrompt':
            html = `
                <div class="screen" style="display:flex; flex-direction:column; justify-content:center; text-align:center; padding:30px;">
                    <img src="ai_character.png" style="width:110px; margin:0 auto 20px;">
                    <h2 style="font-size: 22px; margin-bottom: 15px; color: var(--text-main);">실시간 AI 안내를 받으시겠습니까?</h2>
                    <p style="font-size: 14px; color: var(--text-sub); margin-bottom: 35px; line-height:1.7;">
                        AI '우리 WON'이 모든 가입 과정을<br>실시간으로 안내해 드립니다.
                    </p>
                    <button class="btn-primary" onclick="activateAIMode()" style="margin-bottom: 12px;">예, AI 안내를 받겠습니다</button>
                    <button class="btn-secondary" onclick="renderScreen('riskAssessment')">아니오, 직접 진행하겠습니다</button>
                </div>
            `;
            break;

        case 'riskAssessment':
            html = `
                <div class="screen" style="padding-top: 100px;">
                    <div class="header" onclick="renderScreen('investDetail')" style="margin-bottom: 20px;">
                        <span style="font-size: 14px; color: var(--text-sub);">← 뒤로</span>
                    </div>
                    <h2 style="font-size: 22px; margin-bottom: 20px; color: var(--text-main);">투자 적합성 확인</h2>
                    <div class="balance-card">
                        <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                            <span>고객님 성향</span>
                            <span style="font-weight:700; color:var(--woori-blue);">${state.user.riskProfile}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span>상품 위험도</span>
                            <span style="font-weight:700; color:var(--risk-very-high);">${state.investment.risk}</span>
                        </div>
                    </div>
                    <button class="btn-primary" onclick="renderScreen('multiAgreement')" style="margin-top: 30px;">다음 단계로</button>
                </div>
            `;
            break;

        case 'multiAgreement':
            html = `
                <div class="screen" id="agreement-screen" style="padding-top: 100px;">
                    <div class="header" onclick="renderScreen('riskAssessment')" style="margin-bottom: 15px;">
                        <span style="font-size: 14px; color: var(--text-sub);">← 뒤로</span>
                    </div>
                    <h2 style="font-size: 22px; margin-bottom: 20px; color: var(--text-main);">계약서 및 약관 동의</h2>
                    
                    <div class="agreement-section">
                        <div class="agreement-all">
                            <input type="checkbox" id="check-all" style="width:18px; height:18px;">
                            <label for="check-all" style="font-size: 14px;">전체 동의 (필수/선택 포함)</label>
                        </div>
                        <div class="agreement-item" onclick="openAgreementDetail('confirm')">
                            <div class="agreement-item-left"><span class="mandatory">[필수]</span> 집합투자증권 가입 확인서</div>
                            <div class="agreement-item-right" style="color:var(--woori-blue); font-size:12px;">보기 〉</div>
                        </div>
                        <div class="agreement-item" onclick="openAgreementDetail('desc')">
                            <div class="agreement-item-left"><span class="mandatory">[필수]</span> 투자설명서 주요내용 확인</div>
                            <div class="agreement-item-right" style="color:var(--woori-blue); font-size:12px;">보기 〉</div>
                        </div>
                    </div>
                    <button class="btn-primary" onclick="renderScreen('investInput')" style="margin-top: 15px;">동의하고 가입 진행</button>
                </div>
            `;
            break;

        case 'agreementDetail':
            const isConfirm = state.detailType === 'confirm';
            html = `
                <div class="screen" style="padding-top: 80px;">
                    <div class="header" onclick="renderScreen('multiAgreement')" style="margin-bottom: 15px;">
                        <span style="font-size: 14px; color: var(--text-sub);">← 돌아가기</span>
                    </div>
                    <h2 style="font-size: 20px; margin-bottom: 20px; color: var(--text-main);">
                        ${isConfirm ? '집합투자증권 가입 확인서' : '투자설명서 주요내용 확인'}
                    </h2>
                    <div class="agreement-scroll-box" onscroll="handleAgreementScroll(this)" id="detail-scroll-box">
                        <p><strong>제 1조 (목적)</strong> 본 확인서는 고객이 펀드 가입 시 투자 대상과 위험 요인을 충분히 이해하였음을 확인하는 데 그 목적이 있습니다.</p><br>
                        <p><strong>제 2조 (원금손실위험)</strong> 본 상품은 실적 배당형 상품으로 원금의 손실이 발생할 수 있습니다.</p><br>
                        <p><strong>제 3조 (수수료 안내)</strong> 판매 수수료 0.5%, 연 보수 1.2%가 발생합니다.</p><br>
                        <p><strong>제 4조 (운용 전략)</strong> 글로벌 혁신 기술주에 집중 투자합니다.</p><br>
                        <div style="height: 150px;"></div>
                    </div>
                    <p style="font-size:11px; color:#999; margin-top:10px; text-align:center;">※ 왼쪽 패널의 트리거 버튼을 눌러 시뮬레이션을 시작하세요.</p>
                    <button class="btn-primary" onclick="renderScreen('multiAgreement')" style="margin-top: 20px;">내용 확인 완료</button>
                </div>
            `;
            break;

        case 'investInput':
            html = `
                <div class="screen" style="padding-top: 100px;">
                    <div class="header" onclick="renderScreen('multiAgreement')" style="margin-bottom: 25px;">
                        <span style="font-size: 14px; color: var(--text-sub);">← 뒤로</span>
                    </div>
                    <h2 style="font-size: 22px; margin-bottom: 25px; color: var(--text-main);">투자 금액 설정</h2>
                    <div class="input-group">
                        <label style="font-size: 13px;">가입 금액</label>
                        <input type="number" placeholder="최소 1,000,000원" style="padding: 15px; border-radius: 12px; border: 1px solid #ddd; width: 100%;">
                    </div>
                    <button class="btn-primary" onclick="renderScreen('success')" style="margin-top: 30px;">가입 완료</button>
                </div>
            `;
            break;

        case 'success':
            html = `
                <div class="screen" style="text-align: center; padding-top: 80px;">
                    <div class="success-icon" style="margin-bottom: 20px;">✓</div>
                    <h2 style="font-size: 24px; margin-bottom: 15px; color: var(--text-main);">계약이 완료되었습니다</h2>
                    <button class="btn-primary" onclick="resetApp()">홈으로 이동</button>
                </div>
            `;
            break;
    }

    appContent.innerHTML = html;
}

function openAgreementDetail(type) {
    state.detailType = type;
    renderScreen('agreementDetail');
}

function activateAIMode() {
    state.aiMode = true;
    deviceFrame.classList.add('ai-mode');
    externalVoice.style.display = 'block';
    userVoice.style.display = 'block';
    simulationPanel.style.display = 'flex';
    renderScreen('riskAssessment');
    showVoiceBubble("안녕하세요! AI '우리 WON' 가이드입니다. 왼쪽 패널의 트리거 버튼을 통해 음성 안내 시나리오를 진행할 수 있습니다.");
}

function handleAgreementScroll(el) {
    if (!state.aiMode) return;
    const now = Date.now();
    if (state.lastScrollTime && (now - state.lastScrollTime < 40)) {
        showVoiceBubble("고객님, 너무 빠르게 넘기셨습니다. 중요한 내용을 확인하도록 다시 처음으로 이동합니다.");
        setTimeout(() => { el.scrollTo({ top: 0, behavior: 'smooth' }); }, 800);
    }
    state.lastScrollTime = now;
}

function showVoiceBubble(text) {
    if (!state.aiMode) return;
    const container = document.getElementById('ai-bubble-container');
    if (!container) return;
    container.innerHTML = `<div class="ai-bubble-external">${text}</div>`;
}

function showUserBubble(text) {
    const container = document.getElementById('user-bubble-container');
    if (!container) return;
    container.innerHTML = `<div class="user-bubble-external">${text}</div>`;
    setTimeout(() => { container.innerHTML = ''; }, 4000);
}

function simulateUserQuestion() {
    if (!state.aiMode) return;
    showUserBubble("집합투자증권이 뭐야?");
    setTimeout(() => {
        showVoiceBubble("네, 집합투자증권은 여러 투자자의 자금을 모아 전문가가 운용하는 '펀드'의 공식 용어입니다.");
    }, 1500);
}

function simulateUserAgentRequest() {
    if (!state.aiMode) return;
    showUserBubble("이 부분은 상담사의 연결이 필요해.");
    setTimeout(() => {
        showVoiceBubble("알겠습니다. 즉시 전문 상담사를 연결하겠습니다. 잠시만 기다려 주세요...");
        setTimeout(() => { connectToAgent(); }, 2000);
    }, 1500);
}

function connectToAgent() {
    state.agentMode = true;
    deviceFrame.classList.add('agent-mode');
    const label = document.querySelector('.ai-status-label');
    label.innerHTML = "🟢 전문 상담사 원격 안내 중";
    label.style.background = "#4CAF50";
    showVoiceBubble("안녕하세요, 전문 상담사 김우리입니다. 화면 공유를 통해 상세히 안내해 드리겠습니다.");
    
    if (state.currentScreen === 'agreementDetail') {
        setTimeout(() => { simulateRemoteControl('detail-scroll-box'); }, 1000);
    }
}

function simulateRemoteControl(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const appRect = appContent.getBoundingClientRect();
    const highlight = document.createElement('div');
    highlight.className = 'remote-highlight';
    highlight.style.width = el.offsetWidth + 'px';
    highlight.style.height = el.offsetHeight + 'px';
    highlight.style.left = (rect.left - appRect.left) + 'px';
    highlight.style.top = (rect.top - appRect.top) + 'px';
    appContent.appendChild(highlight);
    showVoiceBubble("지금 강조해 드린 조항이 고객님께서 문의하신 핵심 리스크 관련 내용입니다.");
    setTimeout(() => { if (highlight) highlight.remove(); }, 5000);
}

function updateSessionUI() {
    if (!state.aiMode) {
        deviceFrame.classList.remove('ai-mode');
        deviceFrame.classList.remove('agent-mode');
        if (externalVoice) externalVoice.style.display = 'none';
        if (userVoice) userVoice.style.display = 'none';
        if (simulationPanel) simulationPanel.style.display = 'none';
    }
}

function resetApp() {
    state.aiMode = false;
    state.agentMode = false;
    const label = document.querySelector('.ai-status-label');
    if (label) {
        label.innerHTML = "🔵 AI 실시간 안내 중";
        label.style.background = "var(--woori-cyan)";
    }
    renderScreen('home');
}

// Initial
renderScreen('home');
updateSessionUI();
