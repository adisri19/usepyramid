"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const task_schema_1 = require("./schemas/task.schema");
let TasksService = class TasksService {
    taskModel;
    constructor(taskModel) {
        this.taskModel = taskModel;
    }
    async create(dto, user) {
        const taskData = {
            ...dto,
            workspace: new mongoose_2.Types.ObjectId(user.workspaceId),
            reporter: new mongoose_2.Types.ObjectId(user.sub),
        };
        if (dto.assignee) {
            taskData.assignee = new mongoose_2.Types.ObjectId(dto.assignee);
        }
        if (dto.project) {
            taskData.project = new mongoose_2.Types.ObjectId(dto.project);
        }
        if (dto.parentTask) {
            taskData.parentTask = new mongoose_2.Types.ObjectId(dto.parentTask);
        }
        if (dto.dueDate) {
            taskData.dueDate = new Date(dto.dueDate);
        }
        if (dto.startDate) {
            taskData.startDate = new Date(dto.startDate);
        }
        const task = new this.taskModel(taskData);
        const saved = await task.save();
        return this.findOne(saved.id);
    }
    async findAll(workspaceId, query) {
        const filter = {
            workspace: new mongoose_2.Types.ObjectId(workspaceId),
        };
        if (query.status) {
            filter.status = query.status;
        }
        if (query.project) {
            filter.project = new mongoose_2.Types.ObjectId(query.project);
        }
        if (query.assignee) {
            filter.assignee = new mongoose_2.Types.ObjectId(query.assignee);
        }
        if (query.priority) {
            filter.priority = query.priority;
        }
        if (query.search) {
            filter.title = { $regex: query.search, $options: 'i' };
        }
        return this.taskModel
            .find(filter)
            .populate('assignee')
            .populate('reporter')
            .populate('project')
            .exec();
    }
    async findOne(id) {
        return this.taskModel
            .findById(id)
            .populate('assignee')
            .populate('reporter')
            .populate('project')
            .exec();
    }
    async update(id, dto) {
        const updateData = { ...dto };
        const unsets = {};
        if (dto.assignee) {
            updateData.assignee = new mongoose_2.Types.ObjectId(dto.assignee);
        }
        else if (dto.assignee === null) {
            unsets.assignee = '';
            delete updateData.assignee;
        }
        if (dto.project) {
            updateData.project = new mongoose_2.Types.ObjectId(dto.project);
        }
        else if (dto.project === null) {
            unsets.project = '';
            delete updateData.project;
        }
        if (dto.parentTask) {
            updateData.parentTask = new mongoose_2.Types.ObjectId(dto.parentTask);
        }
        else if (dto.parentTask === null) {
            unsets.parentTask = '';
            delete updateData.parentTask;
        }
        if (dto.dueDate) {
            updateData.dueDate = new Date(dto.dueDate);
        }
        else if (dto.dueDate === null) {
            unsets.dueDate = '';
            delete updateData.dueDate;
        }
        if (dto.startDate) {
            updateData.startDate = new Date(dto.startDate);
        }
        else if (dto.startDate === null) {
            unsets.startDate = '';
            delete updateData.startDate;
        }
        const updateQuery = { $set: updateData };
        if (Object.keys(unsets).length > 0) {
            updateQuery.$unset = unsets;
        }
        const updated = await this.taskModel
            .findByIdAndUpdate(id, updateQuery, { new: true })
            .populate('assignee')
            .populate('reporter')
            .populate('project')
            .exec();
        if (!updated) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        return updated;
    }
    async remove(id) {
        return this.taskModel.findByIdAndDelete(id).exec();
    }
    async findSubtasks(parentTaskId) {
        return this.taskModel
            .find({ parentTask: new mongoose_2.Types.ObjectId(parentTaskId) })
            .populate('assignee')
            .populate('reporter')
            .populate('project')
            .exec();
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TasksService);
//# sourceMappingURL=tasks.service.js.map