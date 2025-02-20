import imaps from 'imap-simple'

async function readEmails(user: string, password: string, host: string, port = 993) {
  const config = {
    imap: {
      user: user,
      password: password,
      host: host,
      port: port,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 10000,
    },
  }

  try {
    const connection = await imaps.connect(config)
    await connection.openBox('INBOX') // Mở hộp thư đến

    // Lấy danh sách ID email theo thứ tự thời gian mới nhất trước
    const searchCriteria = ['UNSEEN']
    const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: false }

    const messages = await connection.search(searchCriteria, fetchOptions)

    // Sắp xếp tin nhắn theo ngày giảm dần
    const sortedMessages = messages.sort((a, b) => {
      const dateA = new Date(a.attributes.date).getTime()
      const dateB = new Date(b.attributes.date).getTime()
      return dateB - dateA // Mới nhất trước
    })

    if (sortedMessages.length > 0) {
      const latestEmail = sortedMessages[0]

      const header = latestEmail.parts.find((part) => part.which === 'HEADER')?.body
      const body = latestEmail.parts.find((part) => part.which === 'TEXT')?.body

      console.log('From:', header?.from)
      console.log('Subject:', header?.subject)
      console.log('Date:', latestEmail.attributes.date)
      console.log('Body:', body)
    } else {
      console.log('Không có email mới.')
    }

    connection.end()
  } catch (error) {
    console.error('Lỗi khi đọc email:', error)
  }
}
