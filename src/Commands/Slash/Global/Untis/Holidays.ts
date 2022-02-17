import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";
import { Category } from "@discordx/utilities";
import Webuntis from "webuntis";
import { config } from "dotenv";
import moment from "moment";

config();

const untis = new Webuntis(
    process.env.SCHOOL ?? "",
    process.env.USERNAME ?? "",
    process.env.PASSWORD ?? "",
    process.env.BASEURL ?? ""
);

@Discord()
@Category("Untis")
@SlashGroup({ description: "utils to get infos from untis", name: "untis" })
export default class Holidays {
    @Slash("ferien")
    @SlashGroup("untis")
    holidays(interaction: CommandInteraction): void {
        untis.login().then(async () => {
            let date: Date = new Date();
            const startDate = (await untis.getHolidays()).at(3)?.startDate;

            const dateString = startDate?.toString();
            const year = dateString?.substring(0, 4);
            const month = dateString?.substring(4, 6);
            const day = dateString?.substring(6, 8);

            if (year && month && day) {
                date = new Date(
                    parseInt(year),
                    parseInt(month) - 1,
                    parseInt(day)
                );
            }
            const daysLeft = moment
                .duration(date.valueOf() - new Date().valueOf())
                .asDays()
                .toFixed(0);

            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`Die Ferien beginnen in ${daysLeft} Tagen`);

            interaction.reply({ embeds: [embed] });
        });
    }
}
