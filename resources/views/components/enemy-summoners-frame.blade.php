<table class="table-auto">
    <thead>
    <tr>
        <th class="px-3">Summoner Name</th>
        <th class="px-3">Champ Name</th>
        <th class="px-3">Armor</th>
        <th class="px-3">Magic Resit</th>
        <th class="px-3">Physical Damage<br> Taken</th>
        <th class="px-3">Magical Damage<br> Taken</th>
        <th class="px-3">DPS received </th>
    </tr>


    </thead>
    <tbody>
    {{--<template x-for="enemyParticipantFrame in enemyParticipantsFrame">


        <tr>
            <td class="text-center" x-text="enemyParticipantFrame.summonerName"></td>
            <td class="text-center" x-text="enemyParticipantFrame.championName"></td>
            <template x-if="enemyParticipantFrame.stats !== undefined">
                <td class="text-center" x-text="enemyParticipantFrame.stats.championStats.armor"></td>
            </template>
            <template x-if="enemyParticipantFrame.stats === undefined">
                <td class="text-center">null</td>
            </template>

            <template x-if="enemyParticipantFrame.stats !== undefined">
                <td class="text-center" x-text="enemyParticipantFrame.stats.championStats.magicResist"></td>
            </template>
            <template x-if="enemyParticipantFrame.stats === undefined">
                <td class="text-center">null</td>
            </template>

            <template x-if="enemyParticipantFrame.stats !== undefined">
                <td class="text-center"
                    x-text="enemyParticipantFrame.stats.championStats.physicalDamageReductionPercent"></td>
            </template>
            <template x-if="enemyParticipantFrame.stats === undefined">
                <td class="text-center">null</td>
            </template>

            <template x-if="enemyParticipantFrame.stats !== undefined">
                <td class="text-center"
                    x-text="enemyParticipantFrame.stats.championStats.magicalDamageReductionPercent"></td>
            </template>
            <template x-if="enemyParticipantFrame.stats === undefined">
                <td class="text-center">null</td>
            </template>

            <template x-if="enemyParticipantFrame.stats !== undefined">
                <td class="text-center" x-text="enemyParticipantFrame.stats.championStats.physicalDamageTaken"></td>
            </template>
            <template x-if="enemyParticipantFrame.stats === undefined">
                <td class="text-center">null</td>
            </template>

        </tr>

    </template>--}}
    <template x-for="enemyParticipantFrame in enemyParticipantsFrame">


        <tr>
            <td class="text-center" x-text="enemyParticipantFrame.summonerName"></td>
            <td class="text-center" x-text="enemyParticipantFrame.championName"></td>
            <td class="text-center"
                x-text="enemyParticipantFrame.stats != undefined ? (enemyParticipantFrame.stats.armor === enemyParticipantFrame.stats.realArmor ? round(enemyParticipantFrame.stats.armor) : `${round(enemyParticipantFrame.stats.armor)} -> ${enemyParticipantFrame.stats.realArmor}`): 'null'"></td>
            <td class="text-center"
                x-text="enemyParticipantFrame.stats != undefined ? (enemyParticipantFrame.stats.mr === enemyParticipantFrame.stats.realMr ? round(enemyParticipantFrame.stats.mr) : `${round(enemyParticipantFrame.stats.mr)} -> ${enemyParticipantFrame.stats.realMr}`): 'null'"></td>

            <td class="text-center"
                x-text="(enemyParticipantFrame.stats != undefined ? round(enemyParticipantFrame.stats.physicalDamageReductionPercent * 100) : '0') + '%'"></td>
            <td class="text-center"
                x-text="(enemyParticipantFrame.stats != undefined ? round(enemyParticipantFrame.stats.magicalDamageReductionPercent * 100 ) : '0') + '%'"></td>
            <td class="text-center"
                x-text="enemyParticipantFrame.stats != undefined ? enemyParticipantFrame.stats.physicalDamageTaken: 'null'"></td>
        </tr>
    </template>
    </tbody>
</table>
