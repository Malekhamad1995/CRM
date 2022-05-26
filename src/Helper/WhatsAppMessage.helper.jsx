export const WhatsAppMessage = (clientPhone) => {
    const user = JSON.parse(localStorage.getItem('session'));
    if (!clientPhone) return null;
    return `https://api.whatsapp.com/send/?phone= ${clientPhone}&text=Hi ${user.fullName} from Property Shop Investment.${user.phoneNumber} ${user.email}&app_absent=0`;
 };
