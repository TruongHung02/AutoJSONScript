import { formatProxy, waitForXpathSelector } from '~/until'
import authProxyPage from './auth-proxy-page'
import { createBrowser } from './create-browser'
import { config } from '~/config'
import { logger } from './logger'
import puppeteer from 'puppeteer'
import { readLatestEmail } from './read-mail'

export default async function getOTP(
  username: string,
  password: string,
  mailServer: 'gmail' | 'veer' | 'bizflycloud',
  proxy?: string,
) {
  if (mailServer === 'gmail') return getOTPGmail(username, password, proxy)
  else if (mailServer === 'veer') return getOTPVeer(username, password, proxy)
  else if (mailServer === 'bizflycloud') return getOTPVeer(username, password, proxy)
  return null
}

async function getOTPGmail(username: string, password: string, proxy?: string) {
  let otp = null

  try {
    const browser = await createBrowser(proxy || undefined)
    const newpage = !proxy
      ? await browser.newPage()
      : await authProxyPage(await browser.newPage(), formatProxy(proxy).user, formatProxy(proxy).password)
    await newpage.setViewport({
      width: Number(config.window_size.split(',')[0]),
      height: Number(config.window_size.split(',')[1]),
    })
    await newpage.goto('http://mail.google.com/mail', {
      waitUntil: 'networkidle2',
    })

    const emailInput = await newpage.waitForSelector('#identifierId')
    if (!emailInput) {
      throw new Error('Loggin to Gmail failed')
    }
    await emailInput.type(username)
    await emailInput?.dispose()

    const nextButton = await newpage.waitForSelector('#identifierNext > div > button > span')
    if (!nextButton) {
      throw new Error('Loggin to Gmail failed')
    }
    await nextButton.click()
    await nextButton.dispose()

    const passwordInput = await newpage.waitForSelector('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input')
    if (!passwordInput) {
      throw new Error('Loggin to Gmail failed')
    }
    await passwordInput.type(password)
    await passwordInput.dispose()

    const nextPassButton = await newpage.waitForSelector('#passwordNext > div > button > span')
    if (!nextPassButton) {
      throw new Error('Loggin to Gmail failed')
    }
    await nextPassButton.click()
    await nextPassButton.dispose()

    // click mail đầu tiên
    const firstMail = await waitForXpathSelector(
      newpage,
      '/html/body/div[6]/div[3]/div/div[2]/div[2]/div/div/div/div[2]/div/div[1]/div/div/div[8]/div/div[1]/div[2]/div/table/tbody/tr[1]',
    )
    if (!firstMail) {
      throw new Error('Loggin to Gmail failed')
    }
    await firstMail.click()
    await firstMail.dispose()

    const OTP = await newpage.waitForSelector('#\\:nw')
    if (!OTP) {
      throw new Error('Loggin to Gmail failed')
    }
    const text = await newpage.evaluate((el) => el.textContent, OTP)
    await OTP.dispose()
    otp = text

    await browser.close()
  } catch (error) {
    logger.error(error as string)
  }

  return otp
}

async function getOTPVeer(username: string, password: string, proxy?: string) {
  let otp = null

  try {
    const argsLaunchOption = [
      `--user-agent=${config.USER_AGENT}`,
      '--enable-cookies',
      '--enable-javascript',
      `--window-size=${config.window_size}`,
      'accept=text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--enable-features=ClipboardAPI',
    ]
    const browser = await puppeteer.launch({
      executablePath: config.EXECUTABLE_PATH,
      headless: true,
      args: argsLaunchOption,
    })

    const newpage = await browser.newPage()
    await newpage.setViewport({
      width: Number(config.window_size.split(',')[0]),
      height: Number(config.window_size.split(',')[1]),
    })
    await newpage.goto('https://mail.veer.vn/', {
      waitUntil: 'networkidle2',
    })

    const emailInput = await newpage.waitForSelector(
      '#app > div > div:nth-child(1) > div.min-h-\\[40vh\\].max-w-3xl.mx-auto.pt-16.md\\:pt-32.relative.z-10 > div > div:nth-child(2) > div > div.user-login-form > form > div.form-group.mb-3 > input',
    )
    if (!emailInput) {
      throw new Error('Loggin to Gmail failed')
    }
    await emailInput.type(username)
    await emailInput?.dispose()

    const passwordInput = await newpage.waitForSelector(
      '#app > div > div:nth-child(1) > div.min-h-\\[40vh\\].max-w-3xl.mx-auto.pt-16.md\\:pt-32.relative.z-10 > div > div:nth-child(2) > div > div.user-login-form > form > div.relative.form-group > input',
    )
    if (!passwordInput) {
      throw new Error('Loggin to Gmail failed')
    }
    await passwordInput.type(password)
    await passwordInput.dispose()

    const logginButton = await newpage.waitForSelector(
      '#app > div > div:nth-child(1) > div.min-h-\\[40vh\\].max-w-3xl.mx-auto.pt-16.md\\:pt-32.relative.z-10 > div > div:nth-child(2) > div > div.user-login-form > form > div.mt-5.flex.flex-col-reverse.sm\\:flex-row.items-center.justify-between > button',
    )
    if (!logginButton) {
      throw new Error('Loggin to Gmail failed')
    }
    await logginButton.click()
    await logginButton.dispose()

    // click mail đầu tiên
    const firstMail = await waitForXpathSelector(newpage, '//*[@id="mail-item-0"]/div/div/div[4]')
    if (!firstMail) {
      throw new Error('Loggin to Gmail failed')
    }
    await firstMail.click()
    await firstMail.dispose()

    // Xử lý cách lấy OTP cho mỗi loại mail khác nhau
    const iframeElement = await waitForXpathSelector(
      newpage,
      '/html/body/div[1]/div/main/div[3]/div[2]/div[1]/div[3]/div/div[2]/div/div[2]/div[2]/div/div[2]/div[1]/div[2]/div[1]/iframe',
    ) // Lấy thẻ iframe
    const frame = await iframeElement?.contentFrame() // Truy cập vào iframe
    if (frame) {
      const OTPSpan = await frame.waitForSelector(
        '#tinymce > table > tbody > tr > td > div:nth-child(2) > div > div > div > div > div > div:nth-child(4) > strong > span',
      )
      if (!OTPSpan) {
        throw new Error('Loggin to Gmail failed')
      }
      const OTP = await frame.evaluate((el) => el.textContent, OTPSpan)
      otp = OTP?.trim()
    }

    await browser.close()
  } catch (error) {
    logger.error(error as string)
  }

  return otp
}

async function getOTPBiz(username: string, password: string) {
  const imapConfig = {
    imap: {
      user: username,
      password: password,
      host: 'imap.bizflycloud.vn',
      port: 993,
      tls: true,
      authTimeout: 3000,
      tlsOptions: { rejectUnauthorized: false }, // Bỏ qua xác thực chứng chỉ
    },
  }
  const latestEmail = await readLatestEmail(imapConfig)
  if (!latestEmail) {
    throw new Error('Cant get mail')
  }
  const emailContent = latestEmail.body

  // Code magic-newton
  const codeIndex = emailContent.indexOf('Login code:')
  if (!codeIndex) {
    throw new Error('Cant get login code')
  }
  return emailContent.substring(codeIndex + 12, codeIndex + 20).replace(' ', '')
}
