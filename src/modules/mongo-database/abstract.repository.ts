import { FilterQuery, Model, Types } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { Logger, NotFoundException } from "@nestjs/common";

export abstract class AbstractRepository <TDocument extends AbstractDocument> {
    protected abstract readonly logger: Logger;

    constructor(protected readonly model:  Model<TDocument>) {}

    async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
        const createdDocument = new this.model({
          ...document,
          _id: new Types.ObjectId(),
        });
        return (await createdDocument.save()).toJSON() as unknown as TDocument;
    }

    async findOne(filter: FilterQuery<TDocument>): Promise<TDocument> {
        const document = await this.model.findOne(filter).lean<TDocument>(true);
        if (!document) {
            this.logger.warn('Document was not found with this filter')
            throw new NotFoundException('Document was not found')
        }
        return document;
    }

    async findOneAndUpdate(filter: FilterQuery<TDocument>, update: TDocument): Promise<TDocument> {
        const updatedDocument = await this.model.findOneAndUpdate(
            filter, update, { new: true }).lean<TDocument>(true);
        if (!updatedDocument) {
            this.logger.warn('Document was not found with this filter')
            throw new NotFoundException('Document was not found')
        }
        return updatedDocument;
    }

    async find(filter: FilterQuery<TDocument>): Promise<TDocument[]> {
        return this.model.find(filter).lean<TDocument[]>(true);
    }

    async findAndDelete(filter: FilterQuery<TDocument>): Promise<TDocument[]> {
        return this.model.findByIdAndDelete(filter).lean<TDocument[]>(true);
    }
}