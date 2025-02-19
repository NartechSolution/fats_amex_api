BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[AssetCapture] (
    [id] NVARCHAR(1000) NOT NULL,
    [locationId] NVARCHAR(1000) NOT NULL,
    [fatsCategoryId] NVARCHAR(1000) NOT NULL,
    [assetDescription] NVARCHAR(1000),
    [serialNumber] NVARCHAR(1000),
    [assetTag] NVARCHAR(1000),
    [quantity] INT,
    [employeeId] NVARCHAR(1000),
    [extNumber] NVARCHAR(1000),
    [faNumber] NVARCHAR(1000),
    [isVerified] BIT NOT NULL CONSTRAINT [AssetCapture_isVerified_df] DEFAULT 0,
    [isGenerated] BIT NOT NULL CONSTRAINT [AssetCapture_isGenerated_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [AssetCapture_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [AssetCapture_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AssetTag] (
    [id] NVARCHAR(1000) NOT NULL,
    [tagNumber] NVARCHAR(1000) NOT NULL,
    [assetCaptureId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [AssetTag_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [AssetTag_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[FatsCategory] (
    [id] NVARCHAR(1000) NOT NULL,
    [mainCatCode] NVARCHAR(1000),
    [mainCategoryDesc] NVARCHAR(1000),
    [mainDescription] NVARCHAR(1000),
    [subCategoryCode] NVARCHAR(1000),
    [subCategoryDesc] NVARCHAR(1000),
    [counter] INT NOT NULL IDENTITY(1,1),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [FatsCategory_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [FatsCategory_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Inventory] (
    [id] NVARCHAR(1000) NOT NULL,
    [assetLocation] NVARCHAR(1000),
    [mainCatCode] NVARCHAR(1000),
    [mainCatDesc] NVARCHAR(1000),
    [mainDesc] NVARCHAR(1000),
    [subCatCode] NVARCHAR(1000),
    [subCatDesc] NVARCHAR(1000),
    [assetCategory] NVARCHAR(1000),
    [image] NVARCHAR(1000),
    [quantity] INT CONSTRAINT [Inventory_quantity_df] DEFAULT 1,
    [serial] NVARCHAR(1000),
    [employeeId] NVARCHAR(1000),
    [extNumber] NVARCHAR(1000),
    [faNumber] NVARCHAR(1000),
    [type] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Inventory_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Inventory_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[locations] (
    [id] NVARCHAR(1000) NOT NULL,
    [company] NVARCHAR(1000),
    [building] NVARCHAR(1000),
    [levelFloor] NVARCHAR(1000),
    [office] NVARCHAR(1000),
    [room] NVARCHAR(1000),
    [locationCode] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [locations_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [locations_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[RefreshToken] (
    [id] NVARCHAR(1000) NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000),
    [expiresAt] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RefreshToken_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [RefreshToken_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RefreshToken_token_key] UNIQUE NONCLUSTERED ([token])
);

-- CreateTable
CREATE TABLE [dbo].[Role] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Role_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Role_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Role_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000),
    [password] NVARCHAR(1000),
    [name] NVARCHAR(1000),
    [role] NVARCHAR(1000) CONSTRAINT [User_role_df] DEFAULT 'fats',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[wbs_category] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    [image] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [wbs_category_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [wbs_category_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[wbs_inventory] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    [description] NVARCHAR(1000),
    [price] FLOAT(53),
    [quantity] INT,
    [batchNumber] NVARCHAR(1000),
    [serialNumber] NVARCHAR(1000),
    [assetLocation] NVARCHAR(1000),
    [expiryDate] DATETIME2,
    [manufactureDate] DATETIME2,
    [image] NVARCHAR(1000),
    [categoryId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [wbs_inventory_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [wbs_inventory_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[wbs_modifier] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    [description] NVARCHAR(1000),
    [price] FLOAT(53),
    [stock] INT,
    [isActive] BIT CONSTRAINT [wbs_modifier_isActive_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [wbs_modifier_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [wbs_modifier_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_UserRoles] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_UserRoles_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_WbsInventoryToWbsModifier] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_WbsInventoryToWbsModifier_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Inventory_assetLocation_mainCatCode_serial_idx] ON [dbo].[Inventory]([assetLocation], [mainCatCode], [serial]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [RefreshToken_userId_idx] ON [dbo].[RefreshToken]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_UserRoles_B_index] ON [dbo].[_UserRoles]([B]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_WbsInventoryToWbsModifier_B_index] ON [dbo].[_WbsInventoryToWbsModifier]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[AssetCapture] ADD CONSTRAINT [AssetCapture_locationId_fkey] FOREIGN KEY ([locationId]) REFERENCES [dbo].[locations]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AssetCapture] ADD CONSTRAINT [AssetCapture_fatsCategoryId_fkey] FOREIGN KEY ([fatsCategoryId]) REFERENCES [dbo].[FatsCategory]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AssetTag] ADD CONSTRAINT [AssetTag_assetCaptureId_fkey] FOREIGN KEY ([assetCaptureId]) REFERENCES [dbo].[AssetCapture]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RefreshToken] ADD CONSTRAINT [RefreshToken_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[wbs_inventory] ADD CONSTRAINT [wbs_inventory_categoryId_fkey] FOREIGN KEY ([categoryId]) REFERENCES [dbo].[wbs_category]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_UserRoles] ADD CONSTRAINT [_UserRoles_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Role]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_UserRoles] ADD CONSTRAINT [_UserRoles_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_WbsInventoryToWbsModifier] ADD CONSTRAINT [_WbsInventoryToWbsModifier_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[wbs_inventory]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_WbsInventoryToWbsModifier] ADD CONSTRAINT [_WbsInventoryToWbsModifier_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[wbs_modifier]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
