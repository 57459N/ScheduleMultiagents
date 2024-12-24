import { useState, useEffect } from 'react';
import './GroupEditor.css';
import { MdFileDownloadDone } from 'react-icons/md';
import { TiDelete } from 'react-icons/ti';

const GROUPS_API = 'https://67691307cbf3d7cefd397d7f.mockapi.io/schedule/groups';

// API interaction functions
const fetchGroups = async () => {
  const response = await fetch(GROUPS_API);
  const data = await response.json();
  return data;
};

const addGroup = async (group) => {
  const response = await fetch(GROUPS_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(group),
  });
  return await response.json();
};

const deleteGroup = async (id) => {
  await fetch(`${GROUPS_API}/${id}`, {
    method: 'DELETE',
  });
};

const GroupsList = () => {
  const [groups, setGroups] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [activeElement, setActiveElement] = useState(null);
  const [newGroupInputs, setNewGroupInputs] = useState({
    flow: '',
    specialty: '',
    number: '',
    subgroup: '',
  });

  useEffect(() => {
    const loadGroups = async () => {
      const data = await fetchGroups();
      setGroups(data);
    };
    loadGroups();
  }, []);

  const toggleExpand = (key) => {
    setExpandedGroups((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(key)) {
        newExpanded.delete(key);
        setActiveElement(null);
      } else {
        newExpanded.add(key);
        setActiveElement(key);
      }
      return newExpanded;
    });
  };

  const handleInputChange = (field, value) => {
    setNewGroupInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddGroup = async (parentGroup, level) => {
    let newGroup = {};
    if (level === 'flow') {
      if (!newGroupInputs.flow) return;
      newGroup = {
        flow: newGroupInputs.flow,
        specialty: null,
        number: null,
        subgroup: null,
        name: `${newGroupInputs.flow} поток`,
      };
      setNewGroupInputs((prev) => ({ ...prev, flow: '' }));
    } else if (level === 'specialty') {
      if (!newGroupInputs.specialty) return;
      newGroup = {
        flow: parentGroup.flow,
        specialty: newGroupInputs.specialty,
        number: null,
        subgroup: null,
        name: `${newGroupInputs.specialty}`,
      };
      setNewGroupInputs((prev) => ({ ...prev, specialty: '' }));
    } else if (level === 'number') {
      if (!newGroupInputs.number) return;
      newGroup = {
        flow: parentGroup.flow,
        specialty: parentGroup.specialty,
        number: newGroupInputs.number,
        subgroup: null,
        name: `${newGroupInputs.number} ${parentGroup.specialty} `,
      };
      setNewGroupInputs((prev) => ({ ...prev, number: '' }));
    } else if (level === 'subgroup') {
      if (!newGroupInputs.subgroup) return;
      newGroup = {
        flow: parentGroup.flow,
        specialty: parentGroup.specialty,
        number: parentGroup.number,
        subgroup: newGroupInputs.subgroup,
        name: `${parentGroup.number} ${parentGroup.specialty} ( ${newGroupInputs.subgroup})`,
      };
      setNewGroupInputs((prev) => ({ ...prev, subgroup: '' }));
    }

    const addedGroup = await addGroup(newGroup);
    setGroups((prev) => [...prev, addedGroup]);
  };

  const handleDeleteGroup = async (id) => {
    await deleteGroup(id);
    setGroups((prev) => prev.filter((group) => group.id !== id));
  };

  const renderGroups = () => {
    const grouped = groups.reduce((acc, group) => {
      const { flow, specialty, number } = group;
      if (!acc[flow]) acc[flow] = {};
      if (specialty && !acc[flow][specialty]) acc[flow][specialty] = {};
      if (number && !acc[flow][specialty][number]) acc[flow][specialty][number] = [];
      if (group.subgroup) acc[flow][specialty][number].push(group);
      return acc;
    }, {});

    return Object.entries(grouped).map(([flow, specialties]) => (
      <div key={flow} className="item">
        <div className="header" onClick={() => toggleExpand(flow)}>
          <span>{expandedGroups.has(flow) ? '▼' : '▶'}</span> Поток {flow}
          <button
            className="btn"
            onClick={() => handleDeleteGroup(groups.find((g) => g.flow === flow)?.id)}>
            <TiDelete size={23} color="#0a3470" />
          </button>
        </div>
        {expandedGroups.has(flow) && (
          <div className="input-wrapper">
            <input
              className="input"
              type="text"
              value={newGroupInputs.specialty}
              onChange={(e) => handleInputChange('specialty', e.target.value)}
              placeholder="Специальность"
            />
            <button className="btn" onClick={() => handleAddGroup({ flow }, 'specialty')}>
              <MdFileDownloadDone size={25} color="#0a3470" />
            </button>
          </div>
        )}
        {expandedGroups.has(flow) &&
          Object.entries(specialties).map(([specialty, numbers]) => (
            <div key={specialty} className="item">
              <div className="header" onClick={() => toggleExpand(`${flow}-${specialty}`)}>
                <span>{expandedGroups.has(`${flow}-${specialty}`) ? '▼' : '▶'}</span> {specialty}
                <button
                  className="btn"
                  onClick={() =>
                    handleDeleteGroup(
                      groups.find((g) => g.flow === flow && g.specialty === specialty)?.id,
                    )
                  }>
                  <TiDelete size={23} color="#0a3470" />
                </button>
              </div>
              {expandedGroups.has(`${flow}-${specialty}`) && (
                <div className="input-wrapper">
                  <input
                    className="input"
                    type="text"
                    value={newGroupInputs.number}
                    onChange={(e) => handleInputChange('number', e.target.value)}
                    placeholder="Номер группы"
                  />
                  <button
                    className="btn"
                    onClick={() => handleAddGroup({ flow, specialty }, 'number')}>
                    <MdFileDownloadDone size={25} color="#0a3470" />
                  </button>
                </div>
              )}
              {expandedGroups.has(`${flow}-${specialty}`) &&
                Object.entries(numbers).map(([number, subgroups]) => (
                  <div key={number} className="item">
                    <div
                      className="header"
                      onClick={() => toggleExpand(`${flow}-${specialty}-${number}`)}>
                      <span>
                        {expandedGroups.has(`${flow}-${specialty}-${number}`) ? '▼' : '▶'}
                      </span>{' '}
                      Номер {number}
                      <button
                        className="btn"
                        onClick={() =>
                          handleDeleteGroup(
                            groups.find(
                              (g) =>
                                g.flow === flow && g.specialty === specialty && g.number === number,
                            )?.id,
                          )
                        }>
                        <TiDelete size={23} color="#0a3470" />
                      </button>
                    </div>
                    {expandedGroups.has(`${flow}-${specialty}-${number}`) && (
                      <div className="input-wrapper">
                        <input
                          className="input"
                          type="text"
                          value={newGroupInputs.subgroup}
                          onChange={(e) => handleInputChange('subgroup', e.target.value)}
                          placeholder="Название подгруппы"
                        />
                        <button
                          className="btn"
                          onClick={() => handleAddGroup({ flow, specialty, number }, 'subgroup')}>
                          <MdFileDownloadDone size={25} color="#0a3470" />
                        </button>
                      </div>
                    )}
                    {expandedGroups.has(`${flow}-${specialty}-${number}`) &&
                      subgroups.map((subgroup) => (
                        <div key={subgroup.id} className="subgroup">
                          {subgroup.subgroup}{' '}
                          <button className="btn" onClick={() => handleDeleteGroup(subgroup.id)}>
                            <TiDelete size={23} color="#0a3470" />
                          </button>
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          ))}
      </div>
    ));
  };

  return (
    <div className="group-editor">
      <h2>Редактор списка групп</h2>
      <div className="group-editor-content">
        {renderGroups()}
        <div className="input-wrapper">
          <input
            className="input"
            type="text"
            value={newGroupInputs.flow}
            onChange={(e) => handleInputChange('flow', e.target.value)}
            placeholder="Номер потока"
          />
          <button className="btn" onClick={() => handleAddGroup(null, 'flow')}>
            <MdFileDownloadDone size={25} color="#0a3470" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupsList;
