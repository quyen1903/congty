"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var DOCUMENT_NAME = 'Project';
var COLLECTION_NAME = 'Projects';
var projectsSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    projectName: { type: String, required: true },
    employee: { type: String, required: true },
    projectCode: { type: String, required: true },
    workpackageCode: { type: String, required: true },
    workpackageName: { type: String, required: true },
    workItem: { type: String, required: true },
    workItemName: { type: String },
    workDate: { type: String, required: true },
    workHours: { type: Number, required: true },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
exports.default = (0, mongoose_1.model)(DOCUMENT_NAME, projectsSchema);
