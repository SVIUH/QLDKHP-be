import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateChatRoomDto } from "../dto/create-chat-room.dto";
import { CreateMessageDto } from "../dto/create-message.dto";

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createChatRoom(dto: CreateChatRoomDto) {
    // kiểm tra đã tồn tại phòng chat giữa student và admin chưa
    const existing = await this.prisma.chatRoom.findFirst({
      where: {
        student_code: dto.student_code,
        admin_id: dto.admin_id,
      },
    });

    if (existing) return existing;

    return this.prisma.chatRoom.create({
      data: {
        student: { connect: { code: dto.student_code } },
        admin: { connect: { admin_id: dto.admin_id } },
      },
    });
  }

  async createMessage(dto: CreateMessageDto) {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { chat_room_id: dto.chat_room_id },
    });

    if (!chatRoom) {
      throw new NotFoundException("Chat room not found");
    }

    const message = await this.prisma.message.create({
      data: {
        content: dto.content,
        sender_type: dto.sender_type,
        chat_room_id: dto.chat_room_id,
      },
    });

    return message;
  }

  async getMessages(chat_room_id: number) {
    return this.prisma.message.findMany({
      where: { chat_room_id },
      orderBy: { timestamp: "asc" },
    });
  }

  async getChatRoomsByStudent(student_code: number) {
    return this.prisma.chatRoom.findMany({
      where: { student_code },
      include: {
        messages: { orderBy: { timestamp: "desc" }, take: 1 }, // lấy tin nhắn cuối cùng
        admin: true,
      },
    });
  }

  async getAllChatRooms() {
    return this.prisma.chatRoom.findMany({
      include: {
        student: true,
        admin: true,
        messages: {
          orderBy: { timestamp: "desc" },
          take: 1, // lấy tin nhắn cuối cùng
        },
      },
    });
  }
}
