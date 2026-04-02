export const kioskTranslations: Record<string, Record<string, any>> = {
  en: {
    kiosk: {
      priority_queue: 'Priority Queue',
      regular_queue: 'Regular Queue',
      patients_waiting: '{count} patients waiting',
      welcome: {
          footer: 'Please select a transaction to begin'
      }
    },
    priority: {
      title: 'Are you a Priority Patient?',
      desc: 'Senior Citizens, PWDs, and Pregnant Women are eligible for priority service.',
      yes: {
        title: 'Yes, I am',
        desc: 'Senior/PWD/Pregnant'
      },
      no: {
        title: 'No, I am not',
        desc: 'Regular Patient'
      },
      footer: 'Please prepare your Priority ID if applicable.'
    },
    payment: {
      title: 'Select Payment Method',
      desc: 'How would you like to settle your transaction?',
      footer: 'You can change this later at the counter.',
      hmo: {
        title: 'HMO/Insurance',
        desc: 'Intellicare, Maxicare, etc.'
      },
      cash: {
        title: 'Cash/Card',
        desc: 'Standard payment'
      }
    },
    summary: {
      title: 'Confirm Details',
      desc: 'Please review your selection before proceeding.',
      footer: 'Press confirm to generate your ticket.'
    },
    action: {
      back: 'Go Back',
      confirm: 'Confirm & Print'
    },
    ticket: {
      title: 'Ticket Generated',
      desc: 'Your ticket is being printed. Please take it.',
      number: 'Your Number'
    },
    label: {
      transaction_type: 'Transaction Type',
      payment_method: 'Payment Method',
      queue_type: 'Queue Type',
      hmo_insurance: 'HMO/Insurance',
      priority_queue: 'Priority Queue'
    }
  },
  fil: {
    kiosk: {
      priority_queue: 'Priority Queue',
      regular_queue: 'Regular Queue',
      patients_waiting: '{count} pasyenteng naghihintay',
      welcome: {
          footer: 'Pumili ng transaksyon para magsimula'
      }
    },
    priority: {
      title: 'Ikaw ba ay Priority Patient?',
      desc: 'Ang mga Senior Citizen, PWD, at Buntis ay kwalipikado para sa priority service.',
      yes: {
        title: 'Oo, ako ay',
        desc: 'Senior/PWD/Buntis'
      },
      no: {
        title: 'Hindi po',
        desc: 'Regular na Pasyente'
      },
      footer: 'Pakihanda ang iyong Priority ID kung mayroon.'
    },
    payment: {
      title: 'Pumili ng Paraan ng Pagbabayad',
      desc: 'Paano mo gustong bayaran ang iyong transaksyon?',
      footer: 'Maaari mo itong baguhin mamaya sa counter.',
      hmo: {
        title: 'HMO/Insurance',
        desc: 'Intellicare, Maxicare, atbp.'
      },
      cash: {
        title: 'Cash/Card',
        desc: 'Karaniwang pagbabayad'
      }
    },
    summary: {
      title: 'Kumpirmahin ang Detalye',
      desc: 'Pakisuri ang iyong pinili bago magpatuloy.',
      footer: 'Pindutin ang kumpirmahin para makuha ang ticket.'
    },
    action: {
      back: 'Bumalik',
      confirm: 'Kumpirmahin'
    },
    ticket: {
      title: 'Nagawa na ang Ticket',
      desc: 'Ang iyong ticket ay nililimbag na. Pakikuha ito.',
      number: 'Iyong Numero'
    },
    label: {
      transaction_type: 'Uri ng Transaksyon',
      payment_method: 'Paraan ng Pagbabayad',
      queue_type: 'Uri ng Queue',
      hmo_insurance: 'HMO/Insurance',
      priority_queue: 'Priority Queue'
    }
  }
}
