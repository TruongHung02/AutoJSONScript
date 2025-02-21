import * as Imap from 'imap-simple'
import { simpleParser } from 'mailparser'
import * as qp from 'quoted-printable'

interface EmailDetails {
  from: string
  subject: string
  body: string
}

export async function readLatestEmail(imapConfig: Imap.ImapSimpleOptions): Promise<EmailDetails | null> {
  try {
    const connection = await Imap.connect(imapConfig)
    await connection.openBox('INBOX')

    const searchCriteria = ['ALL']
    const fetchOptions = { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'], struct: true }
    const messages = await connection.search(searchCriteria, fetchOptions)

    if (messages.length === 0) {
      console.log('Không có email nào trong hộp thư đến.')
      return null
    }

    const latestEmail = messages[messages.length - 1]
    const header = latestEmail.parts.find((part) => part.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)')?.body || ''
    const textPart = latestEmail.parts.find((part) => part.which === 'TEXT')?.body || ''

    const parsedEmail = await simpleParser(textPart)
    const decodedBody = parsedEmail.text ? qp.decode(parsedEmail.text) : ''

    await connection.end()

    return {
      from: parsedEmail.from?.text || '',
      subject: parsedEmail.subject || '',
      body: decodedBody,
    }
  } catch (error) {
    console.error('Lỗi:', error)
    return null
  }
}

// Ví dụ sử dụng
const imapConfig = {
  imap: {
    user: 'bull3081@tourzy.us',
    password: 'Rtn@2024',
    host: 'imap.bizflycloud.vn',
    port: 993,
    tls: true,
    authTimeout: 3000,
    tlsOptions: { rejectUnauthorized: false }, // Bỏ qua xác thực chứng chỉ
  },
}

readLatestEmail(imapConfig).then((email) => {
  if (email) {
    console.log('From:', email.from)
    console.log('Subject:', email.subject)
    // console.log('Body:', email.body)

    const emailContent = email.body

    // Code magic-newton
    const codeIndex = emailContent.indexOf('Login code:')
    if (!codeIndex) {
      throw new Error('Cant get login code')
    }
    console.log(emailContent.substring(codeIndex + 12, codeIndex + 20).replace(' ', ''))
  }
})
