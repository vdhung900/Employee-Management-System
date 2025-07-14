import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/notification',
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private employeeSocketMap = new Map<string, string>(); // employeeId <-> socketId
  
    handleConnection(client: Socket) {
      const employeeId = client.handshake.query.employeeId as string;
      if (employeeId) {
        this.employeeSocketMap.set(employeeId, client.id);
        client.join(employeeId); // join room theo employeeId
      }
      console.log('Client connected:', client.id, 'employeeId:', employeeId);
    }
  
    handleDisconnect(client: Socket) {
      for (const [employeeId, socketId] of this.employeeSocketMap.entries()) {
        if (socketId === client.id) {
          this.employeeSocketMap.delete(employeeId);
          break;
        }
      }
      console.log('Client disconnected:', client.id);
    }
  
    broadcastNotification(data: any) {
      this.server.emit('notification', data);
    }
  
    sendToEmployee(employeeId: string, data: any) {
      this.server.to(employeeId).emit('notification', data);
    }
  }