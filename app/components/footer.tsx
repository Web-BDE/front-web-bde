export default function Footer() {
    const mailtoWeb = "mailto:julien.dubois02@etu.umontpellier.fr?subject=Flibustech - Bug"
    return (
        <footer className="footer">
            <div className="footer__zone">
                <p className="footer__zonetitle">L'équipage</p>
                <ul className="footer__list">
                    <li><a className="footer__link">Contact</a></li>
                    <li><a className="footer__link">Profession de foi</a></li>
                </ul>
            </div>
            <img src="/assets/images/footer_logo.png" alt="Piratech icon" className="footer__image" />
            <div className="footer__zone">
                <p className="footer__zonetitle">Le site</p>
                <ul className="footer__list">
                    <li><a href="https://github.com/Web-BDE" className="footer__link">Code source</a></li>
                    <li><a href={`mailto:${mailtoWeb}`} className="footer__link">Signaler un bug</a></li>
                </ul>
            </div>
        </footer>
    );
}