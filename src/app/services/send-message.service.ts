import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SendMessageService {
  private http = inject(HttpClient);
  
  // Token del bot de Telegram (debe estar en environment)
  private readonly BOT_TOKEN = environment.telegramBotToken;
  private readonly TELEGRAM_API = `https://api.telegram.org/bot${this.BOT_TOKEN}`;

  /**
   * Envía un mensaje al chat de Telegram del usuario con el resumen del pedido
   * usando directamente la API de Telegram
   * @param chatId - ID del chat de Telegram del usuario
   * @param items - Array de items del pedido
   * @param total - Total del pedido
   */
  sendOrderMessage(chatId: string, items: any[], total: number) {
    // Construir mensaje formateado con HTML (más simple y menos propenso a errores)
    let mensaje = '🛍️ <b>Tu Pedido en Kjaras Lucerito</b>\n\n';
    
    items.forEach((item, index) => {
      mensaje += `${index + 1}. <b>${item.name}</b>\n`;
      mensaje += `   Cantidad: ${item.cantidad}\n`;
      mensaje += `   Precio: Bs. ${item.precio.toFixed(2)}\n`;
      mensaje += `   Subtotal: Bs. ${(item.precio * item.cantidad).toFixed(2)}\n\n`;
    });
    mensaje += `━━━━━━━━━━━━━━━━\n`;
    mensaje += `   Envio: Bs. 10\n\n`;
    mensaje += `━━━━━━━━━━━━━━━━\n`;
    mensaje += `💰 <b>Total: Bs. ${total.toFixed(2)}</b>\n\n`;
    mensaje += `✅ Tu pedido ha sido recibido y está siendo procesado.\n`;
    mensaje += `¡Gracias por tu preferencia! 🎉`;

    // Parámetros para la API de Telegram
    const params = {
      chat_id: chatId,
      text: mensaje,
      parse_mode: 'HTML'
    };

    // Enviar mensaje usando la API de Telegram directamente
    return this.http.post<any>(`${this.TELEGRAM_API}/sendMessage`, params).pipe(
      tap((response: any) => {
        if (response.ok) {
          console.log('✅ Mensaje enviado a Telegram:', response.result);
        } else {
          console.error('❌ Error en respuesta de Telegram:', response);
        }
      }),
      catchError(err => {
        console.error('❌ Error al enviar mensaje a Telegram:', err);
        console.error('Detalles del error:', err.error);
        return of(null);
      })
    );
  }
}
