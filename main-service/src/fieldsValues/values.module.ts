import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { numberValue } from "./numberValue.entity";
import { stringValue } from "./stringValue.entity";
import { FieldsModule } from "src/fields/fields.module";
import { ProjectsModule } from "src/projects/projects.module";
import { ValuesService } from "./values.service";
import { ValuesController } from "./values.controller";
import { TasksModule } from "src/tasks/tasks.module";
import { ColumnsModule } from "src/columns/columns.module";
import { enumValue } from "./enumValue.entity";

@Module({
    imports: [
      TypeOrmModule.forFeature([numberValue]),
      TypeOrmModule.forFeature([stringValue]),
      TypeOrmModule.forFeature([enumValue]),
      forwardRef(()=>ProjectsModule),
      forwardRef(()=>FieldsModule),
      forwardRef(()=>TasksModule),
      forwardRef(()=>ColumnsModule),
    ],
    providers: [ValuesService],
    controllers: [ValuesController],
    exports:[ValuesService]
  })
  export class ValuesModule {}