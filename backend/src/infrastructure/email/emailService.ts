import nodemailer from 'nodemailer';
import { config } from '../../config/env.js';
import type { ContactMessage } from '../../domain/contact/ContactMessage.js';

/**
 * Pengiriman email notifikasi kontak.
 *
 * Sengaja teks polos saja: isi formulir datang dari luar, dan body HTML apa
 * pun yang menyisipkan nilai mentah ke dalamnya adalah jalur masuk yang tidak
 * perlu kita buka. Subjek dan replyTo diisi setelah nilai lolos validasi
 * domain (tanpa CR/LF), sehingga tidak ada header yang bisa disisipkan.
 */

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

export async function sendContactEmail(message: ContactMessage): Promise<void> {
  await transporter.sendMail({
    from: config.email.user,
    to: config.email.recipient,
    replyTo: message.email,
    subject: `[Portofolio] ${message.subject}`,
    text: [
      'Pesan baru dari formulir kontak portofolio.',
      '',
      `Nama    : ${message.name}`,
      `Email   : ${message.email}`,
      `Subjek  : ${message.subject}`,
      '',
      'Pesan:',
      message.message,
    ].join('\n'),
  });
}
