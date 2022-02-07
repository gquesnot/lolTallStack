<div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                    <tr>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Summoner Name
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
                            Dps Ad received
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dps Ap received
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DPS true damage received
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DPS received
                        </th>

                    </tr>
                    </thead>
                    <template x-if="enemyParticipants != null">
                        <tbody>
                        <template x-for="(enemyParticipant,idx) in enemyParticipants">
                            <tr :class=" idx %2 === 0  ?'bg-white' : 'bg-gray-100'">
                                <td class=" py-2 whitespace-nowrap text-sm font-medium text-gray-900 flex justify-center content-center" >
                                    <img :src="'http://ddragon.leagueoflegends.com/cdn/' + version+'/img/champion/' + enemyParticipant.champion.name + '.png'"
                                         class="h-10 w-10 rounded-full" alt="">
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    x-text="enemyParticipant.name">
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    x-text="`${round(enemyParticipant.frames[frameId].stats.stats.armor)} -> ${enemyParticipant.frames[frameId].stats.damageTaken.realArmor}`">
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    x-text="`${round(enemyParticipant.frames[frameId].stats.stats.mr)} -> ${enemyParticipant.frames[frameId].stats.damageTaken.realMr}`">
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    x-text="round(enemyParticipant.frames[frameId].stats.damageTaken.armorReduction * 100) + '%'">
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    x-text="round(enemyParticipant.frames[frameId].stats.damageTaken.mrReduction * 100 ) + '%'">

                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    x-text=" enemyParticipant.frames[frameId].stats.damageTaken.dps.ad">

                                </td>

                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    x-text="enemyParticipant.frames[frameId].stats.damageTaken.dps.ap">

                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    x-text="enemyParticipant.frames[frameId].stats.damageTaken.dps.true">

                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    x-text="enemyParticipant.frames[frameId].stats.damageTaken.dps.total()">

                                </td>



                            </tr>
                        </template>
                        </tbody>
                    </template>

                </table>
            </div>
        </div>
    </div>
</div>
