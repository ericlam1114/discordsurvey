import { SlashCommandBuilder } from '@discordjs/builders';

const registerCommand = new SlashCommandBuilder()
  .setName('signup')
  .setDescription('Signup for Newsletter & Airdrops');

export default registerCommand.toJSON();
