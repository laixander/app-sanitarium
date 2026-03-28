import { ref } from 'vue'

const activeLanguage = ref('en')

const messages: Record<string, Record<string, string>> = {
    en: {
        'kiosk.welcome.footer': 'Touch the screen to select your transaction type',
        'kiosk.patients_waiting': '{count} patients currently waiting',
        'kiosk.regular_queue': 'Regular Queue',
        'kiosk.priority_queue': 'Priority Queue',
        
        'payment.title': 'Payment Method',
        'payment.desc': 'Are you using HMO or insurance?',
        'payment.footer': 'HMO patients may be directed to a dedicated verification counter',
        'payment.hmo.title': 'Yes, HMO',
        'payment.hmo.desc': 'I have HMO or insurance coverage',
        'payment.cash.title': 'No, Cash/Card',
        'payment.cash.desc': 'I will pay out of pocket',
        
        'priority.title': 'Special Priority',
        'priority.desc': 'Do you qualify for priority lanes?',
        'priority.footer': 'PWD ID or Senior Card may be required upon verification',
        'priority.yes.title': 'Yes, Priority',
        'priority.yes.desc': 'Senior Citizen / PWD / Pregnant',
        'priority.no.title': 'No, Regular',
        'priority.no.desc': 'Regular Transaction',
        
        'summary.title': 'Review Details',
        'summary.desc': 'Please confirm your transaction details',
        'summary.footer': 'Your queue number will be printed after confirmation',
        'summary.transaction': 'Transaction',
        'summary.payment': 'Payment',
        'summary.queue': 'Queue Type',
        
        'ticket.title': 'Please take your ticket',
        'ticket.desc': 'Proceed to the waiting area and wait for your number to be called.',
        'ticket.number': 'Queue Number',
        
        'action.back': 'Back',
        'action.confirm': 'Confirm to Get Ticket',
        'action.print': 'Printing in {count}s...',
        'action.done': 'Finish'
    },
    fil: {
        'kiosk.welcome.footer': 'Pindutin ang screen upang pumili ng transaksyon',
        'kiosk.patients_waiting': '{count} pasyenteng naghihintay',
        'kiosk.regular_queue': 'Regular na Pila',
        'kiosk.priority_queue': 'Priyoridad na Pila',
        
        'payment.title': 'Paraan ng Pagbayad',
        'payment.desc': 'Gagamit ka ba ng HMO o insurance?',
        'payment.footer': 'Posibleng ipadala ang HMO patiens sa verification counter',
        'payment.hmo.title': 'Oo, HMO',
        'payment.hmo.desc': 'Mayroon akong HMO o insurance card',
        'payment.cash.title': 'Hindi, Cash/Card',
        'payment.cash.desc': 'Magbabayad ako nang mag-isa',
        
        'priority.title': 'Espesyal na Priyoridad',
        'priority.desc': 'Ikaw ba ay sakop ng priority lane?',
        'priority.footer': 'Maaaring hingin ang PWD ID o Senior Card sa counter',
        'priority.yes.title': 'Oo, Priority',
        'priority.yes.desc': 'Senior Citizen / PWD / Buntis',
        'priority.no.title': 'Hindi, Regular',
        'priority.no.desc': 'Regular na Transaksyon',
        
        'summary.title': 'Suriin ang Detalye',
        'summary.desc': 'Kumpirmahin ang detalye ng iyong transaksyon',
        'summary.footer': 'Ang queue number mo ay ipi-print pagkatapos itong makumpirma',
        'summary.transaction': 'Transaksyon',
        'summary.payment': 'Paraan ng Pagbayad',
        'summary.queue': 'Uri ng Pila',
        
        'ticket.title': 'Kunin ang iyong tiket',
        'ticket.desc': 'Pumunta sa waiting area at maghintay tawagin ang iyong numero.',
        'ticket.number': 'Numero sa Pila',
        
        'action.back': 'Bumalik',
        'action.confirm': 'Kumpirmahin',
        'action.print': 'Nagpi-print ({count}s)...',
        'action.done': 'Tapos na'
    }
}

export const useKioskLocale = () => {
    const t = (key: string, params?: Record<string, string | number>) => {
        let str = messages[activeLanguage.value]?.[key] || messages['en']?.[key] || key
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                str = str.replace(`{${k}}`, String(v))
            })
        }
        return str
    }

    return {
        activeLanguage,
        t,
        messages
    }
}
