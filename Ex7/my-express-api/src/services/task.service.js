import prisma from "../lib/prisma.js";

export class TaskService {
  async findAll(userId, filters = {}) {
    const { page = 1, limit = 10, status, priority, search } = filters;
    const skip = (page - 1) * limit;

    const where = { userId: parseInt(userId) };
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id, userId) {
    const task = await prisma.task.findFirst({
      where: {
        id: parseInt(id),
        userId: parseInt(userId),
      },
    });

    if (!task) throw new Error("Task not found");
    return task;
  }

  async create(userId, data) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        userId: parseInt(userId),
      },
    });
  }

  async update(id, userId, data) {
    await this.findById(id, userId);

    return prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
      },
    });
  }

  async delete(id, userId) {
    await this.findById(id, userId);

    return prisma.task.delete({
      where: { id: parseInt(id) },
    });
  }
}
