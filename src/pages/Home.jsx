import { useNavigate } from "react-router-dom";
import '../styles/pages/home.css'
import target from '../assets/icons/target.svg';
import shield from '../assets/icons/shield.svg';
import money from '../assets/icons/money.svg';
import flask from '../assets/icons/flask.svg';
import background1 from '../assets/images/background-1.svg';
import background2 from '../assets/images/background-2.svg';

function Home() {
    const navigate = useNavigate();

    const goToSurvey = () => {
        navigate('/survey')
    };

    const goToAdminLogin = () => {
        navigate('/admin/login')
    };

    return (
        <div>
            <img src={background1} alt="" className="hero-bg" />
            <img src={background2} alt="" className="bottom-bg"></img>

            <main>
                <section className="hero container">
                    <div className="hero-left card">
                        <p>Найди свои<br />идеальные средства<br />для волос за 2 минуты</p>
                        <button className="button" onClick={goToSurvey}>Пройти опрос</button>
                    </div>

                    <div className="hero-right">
                        <h3>Как это работает:</h3>
                        <ol>
                            <li>Ответь на вопросы</li>
                            <li>Мы анализируем твои волосы</li>
                            <li>Ты получаешь персональный набор средств</li>
                        </ol>
                    </div>
                </section>

                <section className="advantages">
                    <div className="title-line">
                        <p>Преимущества</p>
                    </div>

                    <div className="advantages-grid container">
                        <div className="advantage">
                            <img src={target} alt="" />
                            <p>Никаких универсальных советов — только то, что подходит именно тебе</p>
                        </div>
                        <div className="advantage">
                            <img src={shield} alt="" />
                            <p>Учитываем окрашивание, кудри, повреждения и чувствительную кожу головы</p>
                        </div>
                        <div className="advantage">
                            <img src={money} alt="" />
                            <p>Помогаем перестать покупать лишние средства</p>
                        </div>
                        <div className="advantage">
                            <img src={flask} alt="" />
                            <p>Прозрачная логика подбора и состава средств</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;