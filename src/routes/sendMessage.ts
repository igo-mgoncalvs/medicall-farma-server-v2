import { FastifyInstance } from "fastify";
import { Resend } from "resend";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function SendMessage(app: FastifyInstance) {
  app.post('/send-email', async (request) => {
    const bodySchema = z.object({
      email: z.string(),
      phone: z.string(),
      infos: z.string().optional(),
      product: z.string().optional(),
      description: z.string()
    })

    const { description, email, infos, phone, product } = bodySchema.parse(request.body)

    const getEmailToSend = await prisma.contactEmail.findFirstOrThrow()

    const senEmail = await resend.emails.send({
      from: 'contato@medicallfarma.com.br',
      to: getEmailToSend.email,
      subject: 'Contato pelo site Medicall Farma',
      html: `<h3>Um novo contato foi solicitado pelo site</h3>
        <p><b>E-mail:</b> ${email}</p>
        <p><b>Telefone:</b> ${phone}</p>
        ${infos ? `<p><b>Informações:</b> ${infos}</p>`: ""}
        ${product ? `<p><b>Produto de interesse:</b> ${product}</p>`: ""}
        ${description ? `<p><b>Descrição:</b> ${description}</p>`: ""}
        <p>--</p>
        <p>Este e-mail foi enviado de um formulário de contato em MedicAll Farma (http://medicallfarma.com.br)</p>
      `,
    });

    return senEmail
  })
}