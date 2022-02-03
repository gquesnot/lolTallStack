<div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                    <tr>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Summoner Name
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Champ Name
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Armor
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Magic Resit
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Physical Damage Taken
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Magical Damage Taken
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DPS received
                        </th>

                    </tr>
                    </thead>
                    <tbody>
                    <template x-for="(enemyParticipantFrame,idx) in enemyParticipantsFrame">
                        <tr :class=" idx %2 === 0  ?'bg-white' : 'bg-gray-100'">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                                x-text="enemyParticipantFrame.summonerName">
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                x-text="enemyParticipantFrame.championName">
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                x-text="enemyParticipantFrame.stats != undefined ? (enemyParticipantFrame.stats.armor === enemyParticipantFrame.stats.realArmor ? round(enemyParticipantFrame.stats.armor) : `${round(enemyParticipantFrame.stats.armor)} -> ${enemyParticipantFrame.stats.realArmor}`): 'null'">
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                x-text="enemyParticipantFrame.stats != undefined ? (enemyParticipantFrame.stats.mr === enemyParticipantFrame.stats.realMr ? round(enemyParticipantFrame.stats.mr) : `${round(enemyParticipantFrame.stats.mr)} -> ${enemyParticipantFrame.stats.realMr}`): 'null'">
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                x-text="(enemyParticipantFrame.stats != undefined ? round(enemyParticipantFrame.stats.physicalDamageReductionPercent * 100) : '0') + '%'">
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                x-text="(enemyParticipantFrame.stats != undefined ? round(enemyParticipantFrame.stats.magicalDamageReductionPercent * 100 ) : '0') + '%'">

                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                x-text="enemyParticipantFrame.stats != undefined ? enemyParticipantFrame.stats.physicalDamageTaken: 'null'">

                            </td>

                        </tr>
                    </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
