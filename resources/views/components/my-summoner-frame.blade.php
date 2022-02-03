<div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-3 lg:p2-8">
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stat
                        </th>
                        <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Value
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <!-- Odd row -->
                    <tr class="bg-white">
                        <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    Total Gold :

                        </td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                        x-text="totalGold">

                        </td>
                    </tr>
                    <tr class="bg-gray-50">
                        <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    Current Gold :

                        </td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                        x-text="currentGold">

                        </td>
                    </tr>
                    <tr class="bg-white">
                        <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    AD:

                        </td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                        x-text="round(participantFrame.stats.ad)">

                        </td>
                    </tr>
                    <tr class="bg-gray-50">
                        <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    AS:

                        </td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                        x-text="round(participantFrame.stats.as, 2)">

                        </td>
                    </tr>
                    <tr class="bg-white">
                        <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    CRIT:

                        </td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                        x-text="round(participantFrame.stats.crit * 100) + '%'">

                        </td>
                    </tr>
                    <tr class="bg-gray-50">
                        <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    ARMOR PEN:

                        </td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500" colspan="" x-text="round(participantFrame.stats.armorPen) + ' + ' + round(participantFrame.stats.armorPenPercent *100) + '% + ' + round(participantFrame.stats.armorPenBonusPercent*100) + '%' ">

     >
                        </td>
                    </tr>
                    <tr class="bg-white">
                        <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    AP:

                        </td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                        x-text="round(participantFrame.stats.ap)">

                        </td>
                    </tr>
                    <tr class="bg-gray-50">
                        <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    MAGIC PEN:

                        </td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500" x-text="round(participantFrame.stats.magicPen) + ' + ' + round(participantFrame.stats.magicPenPercent *100) + '% + ' + round(participantFrame.stats.magicPenBonusPercent*100) + '%' ">
                        </td>
                    </tr>
                    <tr class="bg-white">
                        <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    HP:

                        </td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                         x-text="round(participantFrame.stats.hp)">

                        </td>
                    </tr>
                    <tr class="bg-gray-50">
                        <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    ARMOR:

                        </td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                        x-text="round(participantFrame.stats.armor)">

                        </td>
                    </tr>
                    <tr class="bg-white">
                        <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    MAGIC RESIST:

                        </td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                        x-text="round(participantFrame.stats.mr)">

                        </td>
                    </tr>
                    <tr class="bg-gray-50">
                        <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    CDR:

                        </td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                        x-text="round(participantFrame.stats.cdr *100) + '%'">

                        </td>
                    </tr>
                    <tr class="bg-white">
                        <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    DPS:

                        </td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                        x-text="`${round(participantFrame.stats.dps)} = (${round(participantFrame.stats.dps - participantFrame.stats.critDps)} + crit: ${round(participantFrame.stats.critDps)})`">

                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
