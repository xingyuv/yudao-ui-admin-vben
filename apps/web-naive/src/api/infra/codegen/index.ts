import { type PageParam, requestClient } from '#/api/request';

export namespace CodegenApi {
  /**
   * 代码生成字段定义 Response VO
   */
  export interface CodegenColumnRespVO {
    /** 编号 */
    id: number;
    /** 表编号 */
    tableId: number;
    /** 字段名 */
    columnName: string;
    /** 字段类型 */
    dataType: string;
    /** 字段描述 */
    columnComment: string;
    /** 是否允许为空 */
    nullable: boolean;
    /** 是否主键 */
    primaryKey: boolean;
    /** 排序 */
    ordinalPosition: number;
    /** Java 属性类型 */
    javaType: string;
    /** Java 属性名 */
    javaField: string;
    /** 字典类型 */
    dictType?: string;
    /** 数据示例 */
    example?: string;
    /** 是否为 Create 创建操作的字段 */
    createOperation: boolean;
    /** 是否为 Update 更新操作的字段 */
    updateOperation: boolean;
    /** 是否为 List 查询操作的字段 */
    listOperation: boolean;
    /** List 查询操作的条件类型 */
    listOperationCondition: string;
    /** 是否为 List 查询操作的返回字段 */
    listOperationResult: boolean;
    /** 显示类型 */
    htmlType: string;
    /** 创建时间 */
    createTime: string; // 假设为 ISO 字符串格式的 LocalDateTime
  }

  /**
   * 代码生成字段定义创建/修改 Request VO
   */
  export interface CodegenColumnSaveReqVO {
    /** 编号 */
    id: number;
    /** 表编号 */
    tableId: number;
    /** 字段名 */
    columnName: string;
    /** 字段类型 */
    dataType: string;
    /** 字段描述 */
    columnComment: string;
    /** 是否允许为空 */
    nullable: boolean;
    /** 是否主键 */
    primaryKey: boolean;
    /** 排序 */
    ordinalPosition: number;
    /** Java 属性类型 */
    javaType: string;
    /** Java 属性名 */
    javaField: string;
    /** 字典类型 */
    dictType?: string;
    /** 数据示例 */
    example?: string;
    /** 是否为 Create 创建操作的字段 */
    createOperation: boolean;
    /** 是否为 Update 更新操作的字段 */
    updateOperation: boolean;
    /** 是否为 List 查询操作的字段 */
    listOperation: boolean;
    /** List 查询操作的条件类型 */
    listOperationCondition: string;
    /** 是否为 List 查询操作的返回字段 */
    listOperationResult: boolean;
    /** 显示类型 */
    htmlType: string;
  }

  /**
   * 表定义分页 Request VO
   */
  export interface CodegenTablePageReqVO {
    /** 表名称，模糊匹配 */
    tableName?: string;
    /** 表描述，模糊匹配 */
    tableComment?: string;
    /** 实体，模糊匹配 */
    className?: string;
    /** 创建时间 */
    createTime?: [string, string]; // 假设为 ISO 字符串格式的 LocalDateTime
  }

  /**
   * 代码生成表定义 Response VO
   */
  export interface CodegenTableRespVO {
    /** 编号 */
    id: number;
    /** 生成场景 */
    scene: number;
    /** 表名称 */
    tableName: string;
    /** 表描述 */
    tableComment: string;
    /** 备注 */
    remark?: string;
    /** 模块名 */
    moduleName: string;
    /** 业务名 */
    businessName: string;
    /** 类名称 */
    className: string;
    /** 类描述 */
    classComment: string;
    /** 作者 */
    author: string;
    /** 模板类型 */
    templateType: number;
    /** 前端类型 */
    frontType: number;
    /** 父菜单编号 */
    parentMenuId?: number;
    /** 主表的编号 */
    masterTableId?: number;
    /** 子表关联主表的字段编号 */
    subJoinColumnId?: number;
    /** 主表与子表是否一对多 */
    subJoinMany?: boolean;
    /** 树表的父字段编号 */
    treeParentColumnId?: number;
    /** 树表的名字字段编号 */
    treeNameColumnId?: number;
    /** 主键编号 */
    dataSourceConfigId: number;
    /** 创建时间 */
    createTime: string; // 假设为 ISO 字符串格式的 LocalDateTime
    /** 更新时间 */
    updateTime: string; // 假设为 ISO 字符串格式的 LocalDateTime
  }

  /**
   * 代码生成表定义创建/修改 Response VO
   */
  export interface CodegenTableSaveReqVO {
    /** 编号 */
    id: number;
    /** 生成场景 */
    scene: number;
    /** 表名称 */
    tableName: string;
    /** 表描述 */
    tableComment: string;
    /** 备注 */
    remark?: string;
    /** 模块名 */
    moduleName: string;
    /** 业务名 */
    businessName: string;
    /** 类名称 */
    className: string;
    /** 类描述 */
    classComment: string;
    /** 作者 */
    author: string;
    /** 模板类型 */
    templateType: number;
    /** 前端类型 */
    frontType: number;
    /** 父菜单编号 */
    parentMenuId?: number;
    /** 主表的编号 */
    masterTableId?: number;
    /** 子表关联主表的字段编号 */
    subJoinColumnId?: number;
    /** 主表与子表是否一对多 */
    subJoinMany?: boolean;
    /** 树表的父字段编号 */
    treeParentColumnId?: number;
    /** 树表的名字字段编号 */
    treeNameColumnId?: number;
  }

  /**
   * 数据库的表定义 Response VO
   */
  export interface DatabaseTableRespVO {
    /** 表名称 */
    name: string;
    /** 表描述 */
    comment: string;
  }

  /**
   * 基于数据库的表结构，创建代码生成器的表和字段定义 Request VO
   */
  export interface CodegenCreateListReqVO {
    /** 数据源配置的编号 */
    dataSourceConfigId: number;
    /** 表名数组 */
    tableNames: string[];
  }

  /**
   * 代码生成表和字段的明细 Response VO
   */
  export interface CodegenDetailRespVO {
    /** 表定义 */
    table: CodegenTableRespVO;
    /** 字段定义 */
    columns: CodegenColumnRespVO[];
  }

  /**
   * 代码生成预览 Response VO
   */
  export interface CodegenPreviewRespVO {
    /** 文件路径 */
    filePath: string;
    /** 代码 */
    code: string;
  }

  /**
   * 代码生成表和字段的修改 Request VO
   */
  export interface CodegenUpdateReqVO {
    /** 表定义 */
    table: CodegenTableSaveReqVO;
    /** 字段定义 */
    columns: CodegenColumnSaveReqVO[];
  }
}

// 查询列表代码生成表定义
export function getCodegenTableList(dataSourceConfigId: number) {
  return requestClient.get<CodegenApi.CodegenTableRespVO[]>(
    `/infra/codegen/table/list?dataSourceConfigId=${dataSourceConfigId}`,
  );
}

// 查询列表代码生成表定义
export function getCodegenTablePage(params: PageParam) {
  return requestClient.get<CodegenApi.CodegenTableRespVO[]>(
    '/infra/codegen/table/page',
    { params },
  );
}

// 查询详情代码生成表定义
export function getCodegenTable(id: number) {
  return requestClient.get<CodegenApi.CodegenDetailRespVO>(
    `/infra/codegen/detail?tableId=${id}`,
  );
}

// 新增代码生成表定义
export function createCodegenTable(data: CodegenApi.CodegenCreateListReqVO) {
  return requestClient.post('/infra/codegen/create', data);
}

// 修改代码生成表定义
export function updateCodegenTable(data: CodegenApi.CodegenUpdateReqVO) {
  return requestClient.put('/infra/codegen/update', data);
}

// 基于数据库的表结构，同步数据库的表和字段定义
export function syncCodegenFromDB(id: number) {
  return requestClient.put(`/infra/codegen/sync-from-db?tableId=${id}`);
}

// 预览生成代码
export function getPreviewCodegen(id: number) {
  return requestClient.get(`/infra/codegen/preview?tableId=${id}`);
}

// 下载生成代码
export function downloadCodegen(id: number) {
  return requestClient.download(`/infra/codegen/download?tableId=${id}`);
}

// 获得表定义
export function getSchemaTableList(params: {
  comment?: string;
  dataSourceConfigId: number;
  name?: string;
}) {
  return requestClient.get<CodegenApi.DatabaseTableRespVO[]>(
    '/infra/codegen/db/table/list',
    { params },
  );
}

// 基于数据库的表结构，创建代码生成器的表定义
export function createCodegenList(data: CodegenApi.CodegenCreateListReqVO) {
  return requestClient.post('/infra/codegen/create-list', data);
}

// 删除代码生成表定义
export function deleteCodegenTable(id: number) {
  return requestClient.delete(`/infra/codegen/delete?tableId=${id}`);
}
