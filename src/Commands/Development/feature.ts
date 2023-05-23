import { PrivateMessage } from '@twurple/chat/lib';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import { getUserApi } from '../../api/userApiClient';
import { getChatClient } from '../../chat';
import { Command } from '../../interfaces/apiInterfaces';

const featureWebhook = new WebhookClient({ url: process.env.DEV_DISCORD_FEATURE_REQUEST as string });

const feature: Command = {
	name: 'feature',
	description: 'Let me know what feature you would like me to add to the twitch bot',
	usage: '!feature [name] <description>',
	execute: async (channel: string, user: string, args: string[], text: string, msg: PrivateMessage) => {
		const chatClient = await getChatClient();
		const userApiClient = await getUserApi();

		const usersInfo = await userApiClient.users.getUserById(msg.userInfo.userId);
		// code for command here
		const name: string = args[0];
		const description: string = args.slice(1).join(' '); // Combine args starting from index 1 into a single string
		const featureEmbed = new EmbedBuilder()
			.setTitle(name)
			.setAuthor({ name: usersInfo?.name!, iconURL: usersInfo?.profilePictureUrl })
			.setDescription(description)
			.setFooter({ text : `Feature request from ${msg.userInfo.userName}` })
			.setTimestamp();

		try {
			await chatClient.say(channel, 'feature request recorded');
			await featureWebhook.send({ embeds: [featureEmbed] });
		} catch (error) {
			console.error(error);
			return;
		}
	}
};
export default feature;