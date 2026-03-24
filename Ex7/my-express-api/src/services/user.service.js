import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export class UserService {
  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: { tasks: true },
        },
      },
    });
  }

  async findById(id) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        tasks: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) throw new Error("User not found");
    return user;
  }

  async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async update(id, data) {
    return prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        email: data.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async delete(id) {
    return prisma.user.delete({
      where: { id: parseInt(id) },
    });
  }
}
