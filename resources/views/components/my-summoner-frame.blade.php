<div class="grid grid-cols-2">

    <div>
        Total Gold :
    </div>
    <div x-text="totalGold">
    </div>
    <div>
        Current Gold :
    </div>
    <div x-text="currentGold">
    </div>
    <div>
        AD:
    </div>
    <div x-text="round(participantFrame.stats.ad)">
    </div>
    <div>
        AS:
    </div>
    <div x-text="round(participantFrame.stats.as, 2)">
    </div>
    <div>
        CRIT:
    </div>
    <div x-text="round(participantFrame.stats.crit * 100) + '%'">

    </div>
    <div>
        ARMOR PEN:
    </div>
    <div >
        <span  x-text="round(participantFrame.stats.armorPen)"></span>
        +
        <span x-text="round(participantFrame.stats.armorPenPercent*100) + '%'"></span>
        +
        <span x-text="round(participantFrame.stats.armorPenBonusPercent*100) + '%'"></span>
    </div>
    <div>
        AP:
    </div>
    <div  x-text="round(participantFrame.stats.ap)">
    </div>
    <div>
        MAGIC PEN:
    </div>
    <div>
        <span  x-text="round(participantFrame.stats.magicPen)"></span>
        +
        <span x-text="round(participantFrame.stats.magicPenPercent*100) + '%'"></span>
        +
        <span x-text="round(participantFrame.stats.magicPenBonusPercent*100) + '%'"></span>
    </div>
    <div>
        HP:
    </div>
    <div x-text="round(participantFrame.stats.hp)">
    </div>
    <div>
        ARMOR:
    </div>
    <div x-text="round(participantFrame.stats.armor)">

    </div>
    <div>
        MAGIC RESIST:
    </div>
    <div  x-text="round(participantFrame.stats.mr)">
    </div>
    <div>
        CDR:
    </div>
    <div  x-text="round(participantFrame.stats.cdr *100) + '%'">
    </div>
    <div>
        DPS:
    </div>
    <div  x-text="`${round(participantFrame.stats.dps)} = (${round(participantFrame.stats.dps - participantFrame.stats.critDps)} + crit: ${round(participantFrame.stats.critDps)})`">
    </div>



</div>
