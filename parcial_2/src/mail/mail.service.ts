import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class MailService implements OnModuleInit {
  private transporter!: nodemailer.Transporter;
  private templates: Record<string, HandlebarsTemplateDelegate> = {};
  private readonly logger = new Logger(MailService.name);

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    await this.createTransporter();
    this.loadTemplates();
  }

  private async createTransporter() {
    const host = this.config.get<string>('MAIL_HOST') || this.config.get<string>('mail.host');
    const port = this.config.get<number>('MAIL_PORT') || this.config.get<number>('mail.port');
    const user = this.config.get<string>('MAIL_USER') || this.config.get<string>('mail.user');
    const pass = this.config.get<string>('MAIL_PASS') || this.config.get<string>('mail.pass');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: port ?? 587,
        secure: false,
        auth: { user, pass },
      });
      this.logger.log('Mail transporter configurado desde env');
      return;
    }

    const testAccount = await nodemailer.createTestAccount();
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    this.logger.warn('Utilizando una cuenta de prueba de Ethereal para el envío de correo electrónico.');
  }

  private loadTemplates() {
    try {
      const templatesDir = path.join(process.cwd(), 'dist', 'mail', 'templates');
      if (!fs.existsSync(templatesDir)) {
        const srcTemplatesDir = path.join(process.cwd(), 'src', 'mail', 'templates');
        if (!fs.existsSync(srcTemplatesDir)) {
          throw new Error('No se encontró el directorio de plantillas');
        }
        this.loadTemplatesFromDir(srcTemplatesDir);
      } else {
        this.loadTemplatesFromDir(templatesDir);
      }
    } catch (err) {
      this.logger.warn('No se encontraron email templates o no se pudieron cargar.');
      this.logger.error(err);
    }
  }

  private loadTemplatesFromDir(templatesDir: string) {
    const files = fs.readdirSync(templatesDir);
    for (const file of files) {
      if (file.endsWith('.hbs')) {
        const name = path.basename(file, '.hbs');
        const content = fs.readFileSync(path.join(templatesDir, file), 'utf8');
        this.templates[name] = handlebars.compile(content);
      }
    }
    this.logger.log(`Cargando ${Object.keys(this.templates).length} email templates desde ${templatesDir}`);
  }

  async sendMail(to: string, subject: string, templateName: string, context: any = {}) {
    try {
      this.logger.debug(`Preparando envío de correo a ${to} usando plantilla ${templateName}`);
      this.logger.debug(`Contexto del correo: ${JSON.stringify(context)}`);
      
      const html = this.templates[templateName]
        ? this.templates[templateName](context)
        : context?.text ?? '';

      this.logger.debug(`Contenido HTML generado: ${html}`);

      const from = this.config.get<string>('MAIL_FROM') || this.config.get<string>('mail.from') || 'no-reply@example.com';
      
      this.logger.debug(`Configuración de correo: from=${from}, to=${to}, subject=${subject}`);

      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      this.logger.log(`Correo enviado a ${to} (messageId: ${info.messageId})`);
      if (nodemailer.getTestMessageUrl(info)) {
        this.logger.log(`URL de vista previa: ${nodemailer.getTestMessageUrl(info)}`);
      }
      return info;
    } catch (error) {
      this.logger.error(`Error al enviar correo a ${to}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }

  async sendWelcome(to: string, context: any) {
    return this.sendMail(to, 'Bienvenida', 'welcome', context);
  }

  async sendTicketChange(to: string, context: any) {
    return this.sendMail(to, 'Cambio en tu ticket', 'ticket-change', context);
  }
}
