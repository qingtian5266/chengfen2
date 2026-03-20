-- Lawyer 项目数据库初始化脚本
-- 数据库：lawyer

CREATE DATABASE IF NOT EXISTS lawyer DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE lawyer;

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键 ID',
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（bcrypt 加密）',
  `email` VARCHAR(100) COMMENT '邮箱',
  `phone` VARCHAR(20) COMMENT '手机号',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
  `role` VARCHAR(20) DEFAULT 'user' COMMENT '角色：admin/user',
  `avatar` VARCHAR(255) COMMENT '头像 URL',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 插入默认管理员账号（密码：admin123）
-- 实际密码需要通过 bcrypt 加密后插入
INSERT INTO `user` (`username`, `password`, `email`, `role`, `status`) 
VALUES ('admin', '$2b$10$YourBcryptHashHere', 'admin@example.com', 'admin', 1);
