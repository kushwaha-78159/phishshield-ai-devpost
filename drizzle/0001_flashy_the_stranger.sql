CREATE TABLE `demoScans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`scanType` enum('audio','video') NOT NULL,
	`threatScore` int NOT NULL,
	`verdict` enum('real','fake','suspicious') NOT NULL,
	`confidence` int NOT NULL,
	`explanation` text,
	`sampleFileUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `demoScans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fileKey` varchar(255) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileUrl` text,
	`scanType` enum('audio','video') NOT NULL,
	`threatScore` int NOT NULL,
	`verdict` enum('real','fake','suspicious') NOT NULL,
	`confidence` int NOT NULL,
	`explanation` text,
	`isDemo` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scans_id` PRIMARY KEY(`id`)
);
