module.exports = async (channel) => {
  await channel.send({
    embeds: [
      {
        title: "📝 Evaluation Testing Waitlist",
        description:
          "**Upon applying, you will be added to a waitlist channel.**\n" +
          "Here you will be pinged when a tester of your region is available.\n" +
          "If you are **HT3 or higher**, a **high ticket** will be created.\n\n" +
          "• **Region** should be the region of the server you wish to test on\n\n" +
          "• **Username** should be the name of the account you will be testing on\n\n" +
          "🛑 **Failure to provide authentic information will result in a denied test.**",
        color: 0x5865f2
      }
    ],
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 1,
            label: "Join Waitlist",
            custom_id: "waitlist_join"
          }
        ]
      }
    ]
  });
};
